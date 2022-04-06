start: ##@docker
	docker-compose up
.PHONY: start

cli: ##@docker get development tool shell
	docker-compose exec cli bash
.PHONY: cli


build: ##@docker get development tool shell
	docker-compose exec cli yarn build
.PHONY: cli

deploy:
	cp "snippets/delivery-widget.liquid" "../grim-theme/theme/snippets/"
	cp "snippets/delivery-widget-product.liquid" "../grim-theme/theme/snippets/"
	cp "build/deliveryApp.css" "../grim-theme/theme/assets/"
	cp "build/deliveryApp.js" "../grim-theme/theme/assets/"
.PHONY: deploy

