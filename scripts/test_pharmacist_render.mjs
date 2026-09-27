import React from 'react';
import { renderToString } from 'react-dom/server';
import PharmacistPortal from '../src/components/portals/PharmacistPortal.jsx';
import ShelfScanner from '../src/components/ShelfScanner.jsx';
import { INITIAL_FACILITIES } from '../src/data/mockData.js';

console.log('Testing PharmacistPortal and ShelfScanner server-side mount...');

try {
  const htmlScanner = renderToString(
    React.createElement(ShelfScanner, {
      facilities: INITIAL_FACILITIES,
      onCommitInventory: () => {}
    })
  );
  console.log('✅ ShelfScanner rendered successfully! Length:', htmlScanner.length);
} catch (err) {
  console.error('❌ ShelfScanner failed to render:', err);
}

try {
  const htmlPortal = renderToString(
    React.createElement(PharmacistPortal, {
      facilities: INITIAL_FACILITIES,
      currentFacility: INITIAL_FACILITIES[1],
      setCurrentFacility: () => {},
      onCommitInventory: () => {},
      transferRouteActive: false
    })
  );
  console.log('✅ PharmacistPortal rendered successfully! Length:', htmlPortal.length);
} catch (err) {
  console.error('❌ PharmacistPortal failed to render:', err);
}
