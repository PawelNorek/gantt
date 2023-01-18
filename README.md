# Getting Started

This is work in production of small project combining Gantt chart theory with some basic financial calculations.

At the moment it is based on Bryntum (https://bryntum.com/) Gantt chart and their tutorial published in Medium.com (https://medium.com/bryntum/creating-a-gantt-chart-with-react-using-next-js-fc080ad8b938).

It also uses Xarrow react library for arrows. Not fully utilized at the moment as there are some issues with rendering.

Work to do:

- At the moment this project is using mockup data. No backend connected. That must be solved at the later stage. I consider using tanstack query library. I will see how it goes. (https://tanstack.com/query/latest)
- No data calculation done - to be added.
- Some logic of adding/removing tasks must be added.

If you want to try it steps are:

- Clone repository
- Install dependicies (pnpm install) (Use npm, yarn if you want. If you are here you know how to use it :).)
- JSON server must be started first. It provides data so app can work without backend at the moment. You will find modified scripts included.

!!!There was a bug as IP for mock data fetch was hard coded in one of components. Before you start the projec change IP of your JSON server in settings.js file.
Replace value for host with whatever is on your end. It may be IP (including port) or domain name.

- Start project itself using pnpm/npm start

Have fun :)
