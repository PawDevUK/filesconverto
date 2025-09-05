# FilesConverto.com

## About

This repository contains the complete codebase for FilesConverto.com. As the project is still in its early development stages, the repository remains relatively small. The goal is for it to evolve into a comprehensive platform with all the essential features needed to support the conversion of the most commonly used file types.

### Tasks to Do

- [ ] First file type to implement conversion is PDF.
- [ ] Tidy up the project and learn how to structure the directory.

##### Front-End

- [ ] Create a progress bar using Tailwind CSS.
- [ ] Create 'How to use' section with 'Step 1,2,3'
- [ ] Create 'File Types' section with cards which each of them will represent file type.
- [ ] Create 'About' section which will explain what service provides.
- [ ] Update Footer.
- [ ] Change main title text from 'Convert Files Effortlessly' to 'Files Converter'
- [ ] Remove temporally from the header none used links.
- [ ] Create logic which recognize the free user.

##### Back-End

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



#### Dropzone Widget
Idea for the better file upload while working with the files is to create some kind of widget on the bottom right side or bottom left side corner e.g chat bot window but smaller so file from the
browser can be easily without switching taps moved from drop box to dropzone of the widget.
