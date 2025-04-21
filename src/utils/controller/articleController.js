import Article from '../models/Article.js';


export const createArticle = async (req, res) => {
  try {
    const {
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      selectedDate
    } = req.body;

    // Log incoming body data
    console.log('Incoming article POST request');
    console.log('Request Body:', req.body);
    console.log('Uploaded File:', req.file);

    // Check required fields
    if (!title || !article_category || !description || !user_id || !author || !address || !selectedDate) {
      console.log('Validation Failed: Missing field(s)');
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Handle cover image
    // let cover_image = null;
    // if (req.file) {
    //   cover_image = req.file.filename;
    //   console.log('Cover image saved as:', cover_image);
    // } else {
    //   console.log('No image file uploaded.');
    // }

    const newArticle = await Article.create({
      title,
      article_category,
      description,
      user_id,
      author,
      address,
      upload_date: selectedDate, 
      // images: cover_image
    });

    console.log('Article successfully created:', newArticle);

    return res.status(201).json({
      message: 'Article created successfully',
      article: newArticle
    });

  } catch (error) {
    console.error('Error creating article:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
