# Interaction Instructions
Mouse Hover: Move your mouse over any circle to trigger a smooth rotation animation.

Mouse Click: Click on any circle to activate a pulsing animation where the circle shrinks and returns to its original size.

# Individual Approach to Animation
I chose to focus on user interaction as the primary driver for animation, transforming the static group artwork into an engaging interactive experience. My approach adds two main types of animations: rotation animation and scale animation.

### Rotation Animation
Circles smoothly rotate when hovered over
Each circle has a unique rotation speed between 0.01 and 0.03 radians per frame
Rotation continues while the mouse remains over the circle.
### Scale Animation
Clicking a circle triggers a smooth shrink/expand animation. Circles shrink to 50% of their original size then expand back. Uses lerp (linear interpolation) for smooth transitions.
# Unique Properties and Changes from Group Code
Key modifications from the original group work:

- New properties added to the Circle class: rotation, isRotating, rotationSpeed. Scaling animation related: originalRadius, targetRadius, isAnimating, animationDirection, animationSpeed.

- Added the update() method to handle animation states
Implemented mouse interaction handlers.

- Added rotation and scale animation systems. containsPoint(): Detects whether the point is in a circle. handleHover(): handles mouse hover handleClick(): handles mouse click.

- Remove noLoop() so the animation can run continuously.

# Inspiration for Animation

Inspiration images：

![art](./assets/art%20work.jpg)

My animation design was inspired by traditional Aboriginal sun artwork, which features distinctive characteristics of Australian Indigenous art - concentric circles, radiating patterns, and dotted decorative elements.

In my interactive animation, I transformed these traditional elements into dynamic digital forms:

- Rotation animations that suggest the constant movement of celestial bodies.
- Pulsing scale animations that mimic the sun's radiating energy.
- Interactive elements that allow users to engage with each circular pattern, creating a personal connection with the artwork.
