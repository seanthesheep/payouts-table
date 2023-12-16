# Medley Assesment - Payouts

Built a table according to the specs and Figma design and added a search feature

[Live Demo](https://medley-table.web.app/)

## Tools

- React
- Vite
- Styled Components
- Typescript

I chose React and Vite for this project. I could have used Next.js as it's a React Framework but it felt a little overkill for this case. It's been a while since I've used Styled Components (I was on the Tailwind hype train for a while) so I wasn't sure the best way to organize them. I included the styles in the same file as the component. I have a couple of uses of 'any' in my Typescript but for the most part I tried to create meaninful types and interfaces and to document using TSDoc.

## Added Features

- Search: I added a search bar to the right that should query a user on input
- Infinite Scroll: Queries next page of results as you scroll
- Load More Button: Added as a fallback in case a manual "load more" is needed

## Installation
```
git clone https://github.com/seanthesheep/payouts-table
cd payouts-table
npm install
npm run dev
```
