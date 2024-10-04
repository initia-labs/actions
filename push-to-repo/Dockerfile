FROM alpine:latest

RUN apk update && apk upgrade && apk add --no-cache git

COPY --chmod=755 entrypoint.sh /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
