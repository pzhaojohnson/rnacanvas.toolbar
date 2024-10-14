# Installation

With `npm`:

```
npm install @rnacanvas/toolbar
```

# Usage

All exports of this package can be accessed as named imports.

```javascript
// some example imports
import { Toolbar, ToolbarToggle } from '@rnacanvas/toolbar';
```

## `Toolbar`

The `Toolbar` class represents the toolbar for the RNAcanvas app.

The toolbar can be repositioned and hidden/unhidden.

```javascript
app; // the RNAcanvas app object

// return the toolbar to its original position
// (before any dragging with the mouse)
app.toolbar.reposition();

app.toolbar.hide();
app.toolbar.isHidden(); // true

app.toolbar.unhide();
app.toolbar.isHidden(); // false
```

The displacement of the toolbar from its original position can also be directly accessed,
though its properties are not currently settable.

```javascript
// X and Y components
app.toolbar.displacement.x;
app.toolbar.displacement.y;

// magnitude and direction angle (in radians)
app.toolbar.displacement.magnitude;
app.toolbar.displacement.direction;
```

## `ToolbarToggle`

The `ToolbarToggle` class represents the toolbar toggle for the RNAcanvas app,
which is used to reposition and hide/unhide the toolbar.

```javascript
app; // the RNAcanvas app object

// reposition and/or hide/unhide the toolbar
app.toolbarToggle.press();
```

The toolbar toggle itself can also be hidden and unhidden.

```javascript
app.toolbarToggle.hide();
app.toolbarToggle.isHidden(); // true

app.toolbarToggle.unhide();
app.toolbarToggle.isHidden(); // false
```
