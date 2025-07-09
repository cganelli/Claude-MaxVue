# MaxVue Demo with Real Images

This folder contains the MaxVue vision correction demo with your actual uploaded images.

## Files

- **maxvue_demo.html** - Original demo with SVG placeholders
- **maxvue-demo-with-images.html** - Generated demo with your actual images embedded
- **generate-demo.js** - Node.js script that creates the demo with embedded images
- **validate-demo.js** - Validation script to check the generated demo
- **generate-demo.spec.js** - Test file for the generator

### Image Files Used

1. **email.jpg** - Gmail inbox screenshot (Email section)
2. **spotify.jpg** - Spotify app screenshot (Music App section)
3. **pug.JPG** - Pug with birthday hat photo (Photo section)
4. **wikipedia.jpg** - Wikipedia mobile page (Website section)
5. **flowers.jpg** - Poppy flowers photo (Camera section)

## How to Use the Demo

1. **Open the generated demo:**
   - Simply open `maxvue-demo-with-images.html` in any modern web browser
   - No server required - all images are embedded as base64 data

2. **Demo Features:**
   - Click the play button (▶) to start the demo
   - Each section displays for 5 seconds total:
     - 3 seconds with blurred image (6px blur)
     - 2 seconds with clear image and "✨ Vision Corrected" indicator
   - Smooth transition from blur to clear over 2 seconds
   - Progress bar shows timing for each section
   - Demo automatically cycles through all 5 sections
   - Images use inline blur styles with requestAnimationFrame rendering delay
   - Double requestAnimationFrame ensures blur renders before visibility
   - Debug logging available in browser console (BLUR_DEBUG, VISIBILITY_DEBUG)

## Regenerating the Demo

If you need to regenerate the demo with different images:

```bash
# Make sure you have Node.js installed
node generate-demo.js

# Validate the generated demo
node validate-demo.js
```

## Technical Details

- Images are converted to base64 data URLs and embedded directly in the HTML
- File size: ~1.3 MB (optimized with new approach)
- Works offline once loaded
- Responsive design with iPhone-style mockup
- Smooth blur transitions using CSS filters
- RequestAnimationFrame ensures blur renders before visibility
- Error handling for failed image loads

## Demo Flow

1. **Email** - Gmail inbox
2. **Music App** - Spotify screenshot
3. **Photo** - Pug with birthday hat
4. **Website** - Wikipedia mobile
5. **Camera** - Poppy flowers

Each section demonstrates how MaxVue's vision correction technology can enhance different types of content.

## Browser Compatibility

Works in all modern browsers:

- Chrome/Edge
- Firefox
- Safari
- Mobile browsers

## Troubleshooting

If images don't load:

- Check that all .jpg files are present in the MaxVue_demo folder
- Regenerate the demo using `node generate-demo.js`
- Check browser console for any errors

---

Generated with MaxVue Demo Generator following CLAUDE.md best practices.
