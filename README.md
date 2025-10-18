# FilesConverto.com

## About

This repository contains the complete codebase for FilesConverto.com. As the project is still in its early development stages, the repository remains relatively small. The goal is for it to evolve into a comprehensive platform with all the essential features needed to support the conversion of the most commonly used file types.

#### To Do

##### Front-End

- [x] Add onLeave to list elements so the dropdown closes on leave.
- [x] Add dropdown to change target format for all files.
- [x] Tidy up the project and learn how to structure the directory.
- [x] Fixed RWD for Header.
- [x] Create 'How it works' section with 'Step 1,2,3'
- [x] Create 'File Types' section with cards which each of them will represent file type.
- [x] Move status info on the right side of the format buton.
- [x] Move the size on the right side of the file name.
- [x] Change the "Choose format" button. (Removed mouse hover and the blue button).
- [x] Remove/diasable "Choose format" button on 'converting...' uploadlist item.
- [x] Remove/diasable "Choose format" button on 'Failed' uploadlist item.
- [x] Remove/diasable "Choose format" button on 'Completed' uploadlist item.
- [x] Center the text in "Choose format".
- [x] Tidy up uploads list items. It need to have right buttons and info for every stage of cicle eg. uploaded to front-end, converted and ready to downoload, downloaded..
- [x] Add multi files upload.
- [x] Remove "Processing..."
- [x] Create mockup logic to convert files.
- [x] Add button to convert all uploaded.
- [x] Disable "convert" button for uploads list items which haven't got choosen target format.
- [x] Add css to push the "trash" and "download" button to the right.
- [x] Add responcive text size for the file size text.
- [x] Remove text in buttons in list items on small devices and leave only icons.
- [x] Adjust buttons size in the uploads list footer as curently they are to big and not possitioned correctly.
- [x] Fix bug where "convert all" button is anabled even if the format of files is not selected.
- [x] Reduce buttons of the upload list items for mobile devices.
- [x] Add random failed on convertion.
- [x] Fix RWD as it is very bad on mobile devices.
- [x] Fix the non-closing mobile menu onClick "Go Premium"
- [x] Fix bug where menu button disapear on mobile devices.
- [x] Create a progress bar using Tailwind CSS.
- [x] Remove temporally from the header none used links.
- [x] Change main title text from 'Convert Files Effortlessly' to 'Files Converter' (It is Convert Files).
- [ ] Create 'About' section which will explain what service provides.
- [ ] Update Footer.
- [ ] Create logic which recognize the free user.

##### Back-End

- [ ] Learn about creating live progress bar for convertion and add this functionality.
- [x] Choose reliable NPM packages for converting PDF documents.
  I HAVE DECIDED TO USE PYTHON PACKAGES AS NPM PACKAGES ARE EMPTY OR UNRELIABLE !!!!
- [ ] Learn how react hook is define and how to use it in Next js Component. How to handle props.
- [ ] Add API directory for pdf.
- [ ] Create the initial logic for uploading and sending files to Python cloud function.
  - Set up a directory for file uploads in `public/uploads` to store uploaded and converted files.
  - Create an API route in Next.js (`app/api/upload/route.ts`) to handle file uploads using `formidable` for parsing and saving files.
  - Integrate with a front-end form styled with Tailwind CSS, adapting the provided login form to include a file input and submission to the API route.
- [ ] Create Python cloud function which will be converting files. Learn how it works and what it does.
- [ ] Create logic which will be storing files for free user for 24H.

Time Line:  
03/07/25  
  I have learn today how NEXT handles communication between front-end, back end via axios and routes.  
  I have today went trough few npm packages and learn that is better to use python packages. I have started to implement pip package and created new directory with python cloud function to handle pdf conversion. At the moment I'm struggling to understand how to declare type script function and pass props to components as it slightly different than in React. I need learn to do it so a file can be uploaded and sent to python cloud function.

11/10/25  
  Focused on improving the user interface and fixing deployment issues. Implemented hover-based format selection for uploaded files, allowing users to change target formats by hovering over format displays. Enhanced the UploadsList component with better responsive design by removing width constraints for mobile compatibility. Added proper TypeScript type safety by making dropdown props optional and fixing missing fileSize properties in mock data that were causing Vercel build failures. Completed bulk format conversion functionality and improved overall user experience with smooth hover interactions. All changes were properly committed and the project is now deployment-ready with resolved compilation errors.

16/10/25  
  Significantly improved the uploads list UI by reorganizing the layout - moved status info to the right side of the format button, repositioned file size next to the file name, and centered text in the "Choose format" button. Removed hover-based format selection in favor of a cleaner, more intuitive dropdown interaction. Updated `UploadsList.tsx` to remove complex hover state management and simplified the component structure. Refactored `DropDown.tsx` to automatically close the dropdown menu after format selection, improving user experience. Enhanced `Dropzone.tsx` to support multiple file uploads (up to 10 files) with placeholder download URLs and default status set to completed. Updated the `README.md` To-Do section by marking multiple front-end tasks as completed including tidying up uploads list items, improving the "Choose format" button functionality, changing the main title text, and removing unused header links. Added new tasks for mobile optimization including reducing buttons on mobile devices and implementing a live progress bar for conversions. All changes focus on improving UI/UX and preparing for backend integration.

17/10/25  
  Completed comprehensive UI/UX improvements and smart button state management. **Major achievement**: Implemented intelligent dropdown and "Convert all" button logic that automatically disables when there are fewer than 2 uploaded files, and enables when 2+ files are uploaded - enhancing user experience and preventing empty operations. Enhanced file upload functionality and implemented realistic conversion progress simulation. Updated `Dropzone.tsx` to support multiple file uploads (up to 20 files) with proper IndexedDB storage using unique IDs for each file, fixing the previous DataError. Added 'use client' directive to prevent hydration mismatches. Implemented mock conversion logic in `UploadsList.tsx` with a `simulateProgress` function that creates realistic irregular progress updates using cubic easing (5-10 seconds duration with random intervals). The progress simulation properly manages file status transitions from uploaded → converting → completed with smooth progress bar updates. Added `checkIfMultiUploaded()` function to dynamically control UI state based on upload count. Enhanced dropdown component with disabled styling and proper prop handling. Disabled individual "Convert" buttons when target format is not selected. Removed unused "Processing..." text and cleaned up component structure. Modified 12+ files across the day with focus on frontend polish, state management, and development tooling. **Total commits today: 17 commits** with comprehensive file modifications including `UploadsList.tsx`, `DropDown.tsx`, `dropDown.types.ts`, `mockUploads.ts`, and `README.md`.

18/10/25  
  **Mobile optimization and navigation fixes**: Completed extensive responsive design improvements and navigation functionality. Fixed critical mobile UX issues by optimizing responsive text sizing and spacing across all upload list components using Tailwind CSS utilities (text-xs/sm responsive classes, space-y adjustments). **Mobile menu enhancement**: Implemented proper mobile menu closure functionality by wrapping navigation links in buttons with onClick handlers, ensuring seamless user experience when navigating to different sections. **Navigation routing**: Created new page routing structure with dedicated pages for API, Tools, Login, and Compress sections, temporarily redirecting to 404 page during development phase. **Smart button refinements**: Enhanced upload validation logic by adding checks for both uploaded files count AND selected target formats, preventing conversion attempts when formats aren't properly selected. **Conversion simulation improvements**: Added realistic random conversion failure simulation (10% chance) and refined file name truncation for better mobile display. **Technical improvements**: Added CSS modules TypeScript definitions and cleaned up component structure by removing unused handleRetry functions. **File management**: Added sample PDF files for testing and development purposes. **README updates**: Marked additional frontend tasks as completed including mobile RWD fixes, button positioning, and random conversion failures. **Total commits today: 11 commits** with primary focus on `UploadsList.tsx`, `Header.tsx`, routing pages, and responsive design optimizations. All mobile compatibility issues resolved with proper button state management and navigation flow.

#### Dropzone Widget

Idea for the better file upload while working with the files is to create some kind of widget on the bottom right side or bottom left side corner e.g chat bot window but smaller so file from the
browser can be easily without switching taps moved from drop box to dropzone of the widget.
