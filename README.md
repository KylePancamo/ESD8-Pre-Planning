# Installation #


<ins>***What's needed:***</ins>

* Visual Studio Code (VSCode)
  * https://code.visualstudio.com/



* NodeJS (Node version 16 or higher is recommended. Version v16.13.2 is preferred since that’s what I used to run everything)
  * https://nodejs.org/download/release/v16.13.2/
  * Windows installer is easiest. 64-bit or 32-bit is available. .msi is the installer, so you don't need to worry about the other files. Just download the 'node-v16.13.2-x64.msi' or 'node-v16.13.2-x86.msi'  depending on machine

  * GitHub Desktop (optional)

I recommend installing this as it will simplify the workflow process with using git. Setup found below



<ins>***Steps:***</ins>

1.Go to https://github.com/KylePancamo/ESD8-Pre-Planning and clone the repository to you local machine

2.Open VSCode in a new window (File -> new window)Select Clone Git Repository…
  -It'll ask "The extension 'GitHub" wants to sign in using GitHub. Select "Allow" and sign in.
  - There should be a dropdown menu with a list of your current repositories. Select ESD8-Pre-Planning
  - Find a new location to save this project. It can be anywhere you want. Once finished cloning, open the cloned repository through the prompt or File -> Open Folder. 

3.Install npm modules in through the terminal
  - Select 'Terminal' located at the top of VSCode then select 'New Terminal'
  - Type the command as follows: npm install
  - Once installed, type: npm start
  - Once started, it should popup a new browser tab with localhost address and the website. 
  - Default website simply contains Home, About and Users.
  - ***Important:*** whenever new modules are downloaded, make sure you npm install once again so your local machine can download what’s required.

4.Developing the frontend…
  - IMPORTANT: The only files that need to be edited are in src unless you know exactly what you're doing
  - Within the src folder, you'll find a few .js, .css and other files.

New files within src can be created to help you develop the frontend further.





<ins>GitHub Desktop Repo Setup: Once everything is installed from above, you can use GitHub desktop for simplicity sake.</ins>
  - Open GitHub Desktop
  - Select 'File' -> 'Add Local Repository'- > Find the react-app-expressjs-nginx path
  - You should now be able to see the projects' History, and the Changes you make.





  - Any changes you make will appear in the GitHub Desktop's Changes tab. To add  them to GitHub:
  - Write a small summary (required) of your change and a description (optional). Click "Commit to...". Now goto the History tab and you will see your changes. Once down, select 'Fetch upstream' if you haven't already, then 'Push'



<ins>Google API Key</ins>
  - Everyone will need the the API key on their local machine for maps to work properly.
    - To make it work, you need to add a file named .env to the root directory. API key can be found on JIRA
    - ***Important:*** The .env file shouldn't appear in changes whenever committing



#######################################################################################



DOCUMENTATION



React documentation can be found here: https://reactjs.org/docs/getting-started.html 

More documentation can be found here: https://create-react-app.dev/docs/documentation-intro
