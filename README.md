# Thrive Frontend Take-home Assesment - Senior Frontend Software Engineer

## Implement a Table in React

[Demo](https://thrive-tech-challenge.vercel.app/)

## Tech stack
- React
- Typescript
- Vite
- @tanstack/react-table
- @tanstack/react-virtual
- faker-js
- Shadcn/ui
- TailwindCSS

## Features

- Table with following fields:
   - id, firstname, lastname, fullname, email, city, registered date, DSR(date since registered)
- Max rows set to 1000
- Infinite scroll with on-demand user generation as the user scrolls through the list
- Virtualization implemented using @tanstack/react-virtual
- Columns are draggable, It is implemented using native html drag/drop with simplicity in mind
- Sortable Columns

## Implementation details

### Infinite scroll + virtualization
- Initially loads 100 users
- As the user scrolls down, more users are generated and appended to the userlist
- Table uses virtualization to render only visible rows + plus 10 extra overscan rows, improving performance

### Data
- All data is generated via `faker-js` at runtime
- `generateUsers` generates data using faker-js
- `getEnhancedUsers` returns generatedUsers with default properties + fullName, DSR

### Draggable Columns
- Users can reorder columns via drag-and-drop
- Internal column order is stored in `columnOrder`

### Scrolling Strategy: Infinite scroll & Occlussion (Virtual) rendering
**This implementation uses a combination of:**

- Infinite Scroll: Fake user data is generated and appended as the user scrolls near the bottom.
- Occlusion-based Rendering (Virtualization): Only the rows visible in the viewport (plus 10 overscan rows) are actually rendered to the DOM.

**How It's Handled in @tanstack/react-virtual:**

- The virtualizer calculates visible row indexes using scroll position and row height (`estimateSize`) which is set to 48px.
- If we have 1000 rows but only 20 fit in the viewport, only ~30 rows are in the DOM (20 visible + 10 overscan/buffer)
- It reuses DOM elements as user scrolls, the virtualizer doesn't create new DOM nodes which could be expensive. Instead, it:
   - Takes rows that scroll out of view at the top
   - Updates their content with new data
   - Repositions them at the bottom using css transform
   - so only the rows that change content gets re-rendered.
- Without virtualization, React renders all rows regardless of whether they are visible in the viewport, which can lead to significant performance issues, especially when dealing with a large number of rows and scrolling through the table.
- The virtualizer recalculates visible rows as the user scrolls, ensuring minimal DOM updates and great performance.

Infinite scroll behaviour (not part of @tanstack/react-virtual)
- When the user scrolls near the bottom, `getEnhancedUsers()` is called to generate a new chunk of rows.
- We cap the total number of rows at 1000 (`MAX_USERS`) to simulate a max users/data.



### Screenshot
<img width="1459" height="733" alt="Screenshot 2025-08-01 at 12 36 14 PM" src="https://github.com/user-attachments/assets/f225288d-9ab7-4f6d-8edf-221badf27921" />

  
