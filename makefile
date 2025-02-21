all:
	CGO_ENABLED=0 go build -v
start:
	./fireheart
clean:
	go fmt ./...