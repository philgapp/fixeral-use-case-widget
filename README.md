# Eat Grim - Delivery widget

## Development

Install your deps:

```yarn install```

Run with:

``yarn start``

After using the build method in the next section, you can use this process to create builds quickly / frequently during development and manual testing:

```
docker exec grim-delivery-widget rm -fr src (DELETE SRC folder from root)
docker cp ./src grim-delivery-widget:root (COPY updated SRC folder from local)
docker exec grim-delivery-widget yarn build (BUILD widget JS)
docker cp grim-delivery-widget:root/build . (COPY to local)
(and then manually copy deliveryApp.js to theme assets and push dev branch to test)

```

## Build
Cross platform, current process is to build and run the new docker container which runs yarn build:

``docker-compose up --build``

Then you can copy the build files from the running container like this:

``docker cp grim-delivery-widget:root/build .``

Previous Unix build commands:

```
make start
make cli
```
## Integration

### Shopify Theme

1. Run `make deploy' in the root directory after build to copy assets and snippets to shopify theme. 
2. **`theme.liquid`** Paste the following snippet somewhere between `<head></head>`
(See [Configuration](##configuration)):
    ```html
        {% render 'delivery-widget' %}
    ```
3. **`product-form.liquid`** - Paste the following snippet inside the product form:

        ```liquid
        {% render 'delivery-widget-product' %}
        ```
4. **`product-form-collection.liquid`** - Paste the following snippet inside the product form:

        ```liquid
        {% render 'delivery-widget-product', product: product %}
        ```
### Recharge Theme engine

1. Copy the snippets/_delivery-widget-subscription.html to
your Recharge theme. If you add through the theme editor it will automatically add to /snippets.
2. Paste the following snippet into the recharge `subscription.html`:
    ```liquid
    {% include '_delivery-widget-subscription.html' %}
    ```

## Configuration

You can configure the Delivery availability app by passing the global config. Available options
are defined in `GlobalConfig` interface located in [./src/schema/types.tsx](./src/schema/types.tsx).

## Development (OLD)

Install your deps:

```sh
$ yarn install
```

Run with:

```sh
$ yarn start
```

Build with:

```sh
$ yarn build
```

Generate api client with:

```sh
$ yarn generate
```
