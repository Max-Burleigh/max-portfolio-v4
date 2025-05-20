#!/bin/bash

# Create a directory for WebP images if it doesn't exist
mkdir -p public/webp

# Function to convert an image to WebP format
convert_to_webp() {
  local input_file=$1
  local filename=$(basename "$input_file")
  local name_without_ext="${filename%.*}"
  local output_file="public/webp/${name_without_ext}.webp"
  
  echo "Converting $input_file to $output_file"
  cwebp -q 85 "$input_file" -o "$output_file"
  
  # Print the mapping for reference
  echo "Original: $input_file -> WebP: $output_file"
}

# Handle special case for Anthropic directory
mkdir -p public/webp/Anthropic

# Convert Anthropic image separately to preserve directory structure
if [ -f "public/Anthropic/Anthropic_Symbol_1.png" ]; then
  echo "Converting Anthropic image..."
  cwebp -q 85 "public/Anthropic/Anthropic_Symbol_1.png" -o "public/webp/Anthropic/Anthropic_Symbol_1.webp"
  echo "Original: public/Anthropic/Anthropic_Symbol_1.png -> WebP: public/webp/Anthropic/Anthropic_Symbol_1.webp"
fi

# Convert all other images in the public directory
echo "Converting other images..."
for img in public/*.{jpg,jpeg,png,gif}; do
  # Skip if no matches found (when the glob doesn't expand)
  [ -e "$img" ] || continue
  convert_to_webp "$img"
done

echo "Conversion complete! Images converted to WebP format in public/webp/"
