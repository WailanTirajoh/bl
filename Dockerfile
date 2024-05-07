# syntax = docker/dockerfile:1

# Use a Ruby Alpine image as the base
FROM registry.docker.com/library/ruby:3.3.0-alpine as base

# Rails app lives here
WORKDIR /rails

# Set production environment
ENV RAILS_ENV="production" \
    BUNDLE_DEPLOYMENT="1" \
    BUNDLE_PATH="/usr/local/bundle" \
    BUNDLE_WITHOUT="development"

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build gems
RUN apk --no-cache add \
    build-base \
    git \
    postgresql-dev \
    # libvips-dev \
    pkgconfig \
    curl \
    nodejs \
    yarn \
    && curl -sSL https://github.com/libvips/libvips/releases/download/v8.11.4/vips-8.11.4.tar.gz | tar xz \
    && cd vips-8.11.4 \
    && ./configure --prefix=/usr/local \
    && make \
    && make install \
    && rm -rf /tmp/*

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 && \
    bundle install && \
    rm -rf ~/.bundle/ "${BUNDLE_PATH}"/ruby/*/cache "${BUNDLE_PATH}"/ruby/*/bundler/gems/*/.git && \
    bundle exec bootsnap precompile --gemfile

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times
RUN bundle exec bootsnap precompile app/ lib/

# Precompiling assets for production without requiring secret RAILS_MASTER_KEY
RUN SECRET_KEY_BASE_DUMMY=1 ./bin/rails assets:precompile

# Final stage for app image
FROM base

# Copy built artifacts: gems, application
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build /rails /rails

# Run and own only the runtime files as a non-root user for security
RUN adduser -D rails && \
    chown -R rails:rails db log storage tmp
USER rails:rails

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD ["./bin/rails", "server"]
