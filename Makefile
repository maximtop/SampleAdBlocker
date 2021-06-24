.PHONY: build

EXTENSION_SRC = "SampleAdBlocker Extension/extension"
EXTENSION_TARGET = "SampleAdBlocker Extension/Resources"

setup-extension:
	cd ${EXTENSION_SRC}; yarn

# run before building
setup: setup-extension

build-extension:
	cd ${EXTENSION_SRC}; yarn build
	cp -r ""${EXTENSION_SRC}"/build/" ${EXTENSION_TARGET}

# run after setup
build: build-extension

lint:
	cd ${EXTENSION_SRC}; yarn lint