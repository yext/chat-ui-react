## Testing Process

### Unit Testing
We use Jest as our framework for unit tests. The jest tests files follow the pattern `**.test.ts(x)`. Execute the unit tests with the following command:
```
npm run test
```

### Test Site
To facilitate manual verification, a React test site has been setup in `/test-site`. There is an App component with `ChatPanel` and `ChatPopUp` components configured. 

To set up the test site, make sure you have a `.env` file configured following the `.sample.env` file. Then, run the following commands:
```
npm i
npm run start
```

### Storybook
chat-ui-react also support a component preview site, power by storybook framework. Each preview, or story, is defined under the `**.stories.tsx` files in the `/tests` folder.

To view storybook site locally, run `npm run storybook`

Make sure to add stories when there's a new component or a feature update that is worth providing a UI snapshot to users.

## Build Process

Before initiating the build, run the linting process to identify and address any errors or warnings. Use the following command:
```
npm run lint
```

To build the library, execute:
```
npm run build
```
This will create the bundle in the `/dist` directory. This command will also generate documentation files and the `THIRD-PARTY-NOTICES` file.

For guidelines on pull request and version publish process, visit Chat SDK wiki page.