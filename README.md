# Portfolio Screenshot Assets

This project expects several screenshot images in `public/` and `public/webp/` for the project previews. Binary files aren't included in version control, so you'll need to generate them yourself.

## Generating Screenshots

Run the following commands from the repository root to capture each preview image using [thum.io](https://image.thum.io/):

```bash
curl -L "https://image.thum.io/get/width/1200/https://www.vinscribe.com" -o public/vinscribe.png
curl -L "https://image.thum.io/get/width/1200/https://carlypsphoto.com" -o public/carlypsphoto.png
curl -L "https://image.thum.io/get/width/1200/https://fullleafteacompany.com" -o public/fullleaftea.png
curl -L "https://image.thum.io/get/width/1200/https://wholesale.fullleafteacompany.com" -o public/fullleafwholesale.png
curl -L "https://image.thum.io/get/width/1200/https://shopdowntown.org" -o public/shopdowntown.png
```

After downloading the images, convert them to WebP format for optimized loading:

```bash
./convert-to-webp.sh
```

This will create the corresponding `.webp` files in `public/webp/` referenced by the project components.

