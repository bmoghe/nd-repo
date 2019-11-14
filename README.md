This Discovery project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!


## Reusable Components

> Component are available in 

    ├── src                   
        └── shared                    
            └──components              
                ├── list                # list Component
                ├── sidebar-container   # expand collapese sidebar Component
                
### `list Component`
How to use it in your app:

```js
import React from 'react';
import AeList from 'shared/components';

const options = [
  { value: 'chocolate', label: 'Chocolate', custom: true, disabled: false },
  { value: 'strawberry', label: 'Strawberry', custom: true, disabled: false },
  { value: 'vanilla', label: 'Vanilla', custom: true, disabled: false },
];

class App extends React.Component {
  
  render() {
    return (
       <AeList
        list={ options }
        isItemDraggable={ true }
        isItemDisabled={ true }
        iconForItem={ 'outline-budicon-two-grids' }
        displayProperty={ 'label' }
        showOptionKey={'custom'}
        handleDeleteClick={ this.deleteCustomAttr }
        handleEditClick={ this.editCustomAttr } />
    );
  }
}
```

## Props

Common props you may want to specify include:

- `list`                - Array of objects.
- `isItemDraggable`     - make element draggable 
- `isItemDisabled`      - apply disable state to item [ need disabled flag in object of list ]
- `iconForItem`         - Add icon for the all list item.
- `showOptionKey`       - show option on hover of item [ need showOption flag in object of list ]
- `handleDeleteClick`   - If option is shown then callback option for delete option 
- `handleEditClick`     - If option is shown then callback edit for delete option 
- `displayProperty`     - binding key to show title for the item in list

