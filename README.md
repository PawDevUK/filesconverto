# FilesConverto.com

## About

This is the repository for FilesConverto.com, which holds the entire codebase. Like every project, it is currently a small repository as it is in the beginning stages of development. I hope it will grow into a robust project with all the necessary features to allow users to convert most popular file types.

### Tasks to Do

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

- [ ] Create the initial logic for uploading and converting files.
  - Set up a directory for file uploads in `public/uploads` to store uploaded and converted files.
  - Create an API route in Next.js (`app/api/upload/route.ts`) to handle file uploads using `formidable` for parsing and saving files.
  - Add logic for file conversion using `sharp` for image formats (e.g., PNG to JPEG) or CloudConvert for broader format support (e.g., PDF to Word).
  - Integrate with a front-end form styled with Tailwind CSS, adapting the provided login form to include a file input and submission to the API route.

- [ ] Create logic which will be storing files for free user for 24H.




#### Dropzone Widget
Idea for the better file upload while working with the files is to create some kind of widget on the bottom right side or bottom left side corner e.g chat bot window but smaller so file from the
browser can be easily without switching taps moved from drop box to dropzone of the widget.