# Mobile Testing Guide

## Changes Made

### 1. Layout Fixes for Mobile
- **Fixed bottom controls visibility**: Added proper safe area insets and sticky positioning
- **Dynamic viewport height**: Using `100dvh` for better mobile browser support (especially iOS Safari)
- **Proper flex layout**: Ensured header, main, and footer are properly sized
- **iOS-specific fixes**: Added `-webkit-fill-available` for iOS Safari compatibility
- **Scroll improvements**: Added proper overflow handling and touch scrolling

### 2. Voice Mode Improvements for iOS
- **iOS voice loading**: Added proper voice loading for iOS speech synthesis
- **User interaction handling**: Added delays to ensure iOS recognizes user interaction
- **Error recovery**: Added better error handling for "already started" errors
- **Voice synthesis delay**: Added 100ms delay for iOS Safari compatibility

### 3. Touch Target Improvements
- **Minimum touch sizes**: All buttons now have minimum 44x44px touch targets (Apple HIG standard)
- **Input font size**: Set to 16px to prevent iOS zoom on focus
- **Better button spacing**: Improved spacing for easier tapping

## Testing Checklist

### iPhone 15 Pro Max Testing

#### Layout Tests
- [ ] Open the app in Safari on iPhone 15 Pro Max
- [ ] Check if bottom input controls are visible
- [ ] Try scrolling the chat messages - should scroll smoothly
- [ ] Check if the footer stays at the bottom
- [ ] Rotate to landscape - check if layout adapts properly
- [ ] Check if safe area (notch area) is properly handled

#### Voice Mode Tests
1. **Enable Voice Mode**
   - [ ] Tap the green microphone button
   - [ ] Check if voice mode activates (should show large circular indicator)
   - [ ] Check if microphone permission is requested (first time only)

2. **Voice Input**
   - [ ] Speak a question in Italian (e.g., "Parlami del Colosseo")
   - [ ] Check if your speech is transcribed
   - [ ] Check if the AI responds with voice
   - [ ] Verify the response is also shown as text

3. **Voice Mode Cycle**
   - [ ] After AI speaks, it should automatically start listening again
   - [ ] Try asking multiple questions in sequence
   - [ ] Check if the cycle continues smoothly

4. **Exit Voice Mode**
   - [ ] Tap the red "Exit Voice Mode" button
   - [ ] Verify you return to text mode
   - [ ] Check if you can type normally

#### Input Tests
- [ ] Tap the input field - should NOT zoom in (16px font prevents this)
- [ ] Type a message and send
- [ ] Check if keyboard doesn't cover the input
- [ ] Try the send button - should be easy to tap

#### Button Tests
- [ ] All buttons should be easy to tap (44x44px minimum)
- [ ] Language switcher buttons work
- [ ] Menu button (mobile) opens properly
- [ ] All buttons have proper touch feedback

### Other iOS Devices
Test on:
- [ ] iPhone SE (small screen)
- [ ] iPhone 14 Pro (standard size)
- [ ] iPad (tablet layout)

### Android Testing
- [ ] Chrome on Android
- [ ] Samsung Internet
- [ ] Check voice mode works
- [ ] Check layout is correct

### Different Orientations
- [ ] Portrait mode
- [ ] Landscape mode
- [ ] Rotation transition is smooth

## Known iOS Limitations

### Voice Recognition
- iOS Safari has limited Web Speech API support
- Voice recognition may not work in:
  - Private browsing mode
  - Some iOS versions below 14.5
  - When microphone permission is denied

### Workarounds Implemented
1. **Voice loading**: Voices are loaded asynchronously
2. **Delay before starting**: 100ms delay ensures iOS is ready
3. **Error recovery**: Automatic restart if recognition fails
4. **User interaction**: Voice mode starts immediately on button tap

## Troubleshooting

### Voice Mode Not Working
1. **Check microphone permission**
   - Settings > Safari > Microphone
   - Allow microphone access for the site

2. **Check iOS version**
   - iOS 14.5+ recommended
   - Update if necessary

3. **Try in regular Safari**
   - Not in private mode
   - Not in third-party browsers

4. **Restart the app**
   - Close Safari completely
   - Reopen the app

### Bottom Controls Not Visible
1. **Check if using latest version**
   - Clear cache and reload
   - Hard refresh (Cmd+Shift+R on desktop)

2. **Check viewport**
   - Should see full input field
   - Should see send button
   - Should see voice button

3. **Try scrolling**
   - Scroll to bottom of chat
   - Footer should be sticky

### Input Zooms on Focus
- This should be fixed with 16px font size
- If still zooming, check if CSS is loaded properly

## Browser Console Debugging

Open Safari Developer Tools (on Mac):
1. Connect iPhone via USB
2. Safari > Develop > [Your iPhone] > [Your Site]
3. Check console for errors:
   - "Speech recognition error" - permission or API issue
   - "Speech synthesis error" - voice loading issue
   - "Failed to start recognition" - iOS limitation

## Performance Testing

### Smooth Scrolling
- [ ] Chat messages scroll smoothly
- [ ] No lag when typing
- [ ] Animations are smooth (60fps)

### Voice Mode Performance
- [ ] Voice recognition starts quickly
- [ ] Speech synthesis plays without delay
- [ ] No audio glitches or stuttering

### Memory Usage
- [ ] App doesn't slow down after extended use
- [ ] Voice mode doesn't cause memory leaks

## Accessibility Testing

- [ ] VoiceOver works with all buttons
- [ ] Touch targets are large enough
- [ ] Color contrast is sufficient
- [ ] Text is readable at default size

## Next Steps

If issues persist:
1. Check browser console for specific errors
2. Test on different iOS versions
3. Try different network conditions
4. Test with different languages

## Contact

If you find any issues during testing, please note:
- Device model and iOS version
- Browser and version
- Specific steps to reproduce
- Screenshots or screen recordings
- Console error messages
