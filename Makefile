BUCKET=kretch.org

all:
	jekyll build
	aws s3 rm s3://$(BUCKET) --recursive
	aws s3 sync _site/. s3://$(BUCKET)
