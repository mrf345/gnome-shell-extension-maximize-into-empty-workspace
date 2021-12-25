restart:
	busctl --user call org.gnome.Shell /org/gnome/Shell org.gnome.Shell Eval s 'Meta.restart("Restarting…")'
log:
	journalctl -f -o cat /usr/bin/gnome-shell
test:
	glib-compile-schemas src/schemas/
	rm -rf ~/.local/share/gnome-shell/extensions/maximize-into-empty-workspace@mfeddad.xyz
	cp -rf src/ ~/.local/share/gnome-shell/extensions/maximize-into-empty-workspace@mfeddad.xyz
	$(MAKE) restart
	$(MAKE) log
install:
	npm i --quiet --no-progress .
lint:
	npx standard
format:
	npx standard --fix
build: format
	glib-compile-schemas src/schemas/
	rm -rf dist
	mkdir dist
	zip -j9 dist/gnome-shell-extension-maximize-into-empty-workspace.zip src/*
