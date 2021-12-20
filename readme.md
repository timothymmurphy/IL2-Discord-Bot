# IL-2 Sturmovik Mission Info Discord Bot
A Discord bot to display information for an IL-2 Sturmovik server.

# Setup
## Create a Discord bot
1. Navigate to the Discord [developer portal](https://discord.com/developers/applications) and log in to your account.
2. Click "New Application"
3. Enter your bot's name and click "Create"
4. Go to the "Bot" tab and retrieve your token. Keep this handy as it will go inside your `config.json`
## Download dependencies
- This project requires [Node.js](https://nodejs.org/en/download/) version 16.6 or higher
- Open a terminal in the project directory, and run the following command: `npm install` - this will download the libraries needed for this project
## Launch bot
Enter `node bot.js` from a terminal window in the location that you downloaded the project to in order to start the bot.

# About
I was commissioned to make this for a friend and am otherwise unfamiliar with the game.

The goal of this project was to display the information found on [this](http://stats.virtualpilots.fi:8000/en/faq/) webpage to the community's Discord server every minute.
## Screenshots
This is the server's website that displays the current game information:
[/screenshots/website.png](/screenshots/website.png)

This is the bot which posts to a channel in their Discord server every minute with data from the website:
[/screenshots/bot.png](/screenshots/bot.png)