# 📍 How to Adjust Dot Opacity - Quick Guide

## Location
**File:** `src/components/Canvas.jsx`  
**Line:** Around line 27

## Current Settings (More Visible)
```jsx
color={theme === 'dark' ? '#707070' : '#909090'}
```

## Understanding Hex Colors

### Dark Mode (First Value)
The format is `#RRGGBB` where higher values = lighter/brighter = MORE visible

- `#000000` = Black (invisible on dark background)
- `#404040` = Dark Gray (slightly visible)
- `#707070` = **Medium Gray (CURRENT - good visibility)** ✅
- `#909090` = Light Gray (very visible)
- `#FFFFFF` = White (maximum visibility)

### Light Mode (Second Value)
Lower values = darker = MORE visible on light background

- `#FFFFFF` = White (invisible on white background)
- `#d0d0d0` = Very Light Gray (barely visible)
- `#909090` = **Medium Gray (CURRENT - good visibility)** ✅
- `#707070` = Dark Gray (very visible)
- `#000000` = Black (maximum visibility)

## Examples - Copy & Paste

### Subtle Dots (Low Visibility)
```jsx
color={theme === 'dark' ? '#404040' : '#d0d0d0'}
```

### Moderate Dots (Medium Visibility) - **CURRENT**
```jsx
color={theme === 'dark' ? '#707070' : '#909090'}
```

### Bold Dots (High Visibility)
```jsx
color={theme === 'dark' ? '#a0a0a0' : '#606060'}
```

### Very Bold Dots (Maximum Visibility)
```jsx
color={theme === 'dark' ? '#c0c0c0' : '#404040'}
```

## Quick Visual Reference

```
DARK MODE:              LIGHT MODE:
#404040 ░               #d0d0d0 ░
#505050 ░░              #c0c0c0 ░░
#606060 ░░░             #b0b0b0 ░░░
#707070 ░░░░ ← CURRENT  #909090 ░░░░ ← CURRENT
#808080 ░░░░░           #808080 ░░░░░
#909090 ░░░░░░          #707070 ░░░░░░
#a0a0a0 ░░░░░░░         #606060 ░░░░░░░
```

## Step-by-Step Instructions

1. Open `src/components/Canvas.jsx`
2. Find line ~27 with the `color=` property
3. Change the hex values:
   - First value (dark mode): Higher = More visible
   - Second value (light mode): Lower = More visible
4. Save the file
5. The changes will apply immediately in dev mode!

## Pro Tips

- Test both themes after making changes
- Start with small adjustments (change by #101010 at a time)
- The dots should be visible but not distracting
- Different monitors may show colors differently
- You can also adjust the `size` property (currently 1) to 1.5 or 2 for bigger dots

## Other Customization Options

In the same `<Background>` component, you can also adjust:

```jsx
<Background 
  variant="dots"        // or "lines" for grid lines
  gap={20}             // Distance between dots (try 15-30)
  size={1}             // Dot size (try 1-3)
  color={...}          // Dot color (what we adjusted)
/>
```

Happy customizing! 🎨
