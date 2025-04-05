backend - save users’ auth, mongodb for tasks and calendar info, user info and preferences, dashboard for the display,

extension popup has: - current coins - productivity suggestions(income from the suggestion) - dashboard link for more and profile view

APIs

- post /userinfo : saves user preferences
- get /suggestions : returns suggestions of what the user should be doing to be productive
- post /site-metric : passes site visited, and returns productivity score(+ or -)
- post auth: signs in the user
- get balance: returns the amount of coins the user has.
