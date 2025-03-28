import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Sample video data
const videos = [
  {
    id: 1,
    title: "Learn Web Development in 2023 - Full Stack Mastery",
    description: "This comprehensive guide will take you from beginner to professional web developer in 2023. Learn HTML, CSS, JavaScript, React, Node.js, and more!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "CodeMaster",
    channelAvatarUrl: "https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 1254789,
    likes: 45200,
    dislikes: 1200,
    duration: "12:45",
    uploadDate: "2023-01-15T00:00:00Z"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals - Neural Networks Explained",
    description: "Understand the core concepts behind neural networks and how they're powering the AI revolution. Perfect for beginners to data science!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "AI Academy",
    channelAvatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 857432,
    likes: 32100,
    dislikes: 950,
    duration: "18:27",
    uploadDate: "2023-02-20T00:00:00Z"
  },
  {
    id: 3,
    title: "10 High-Protein Vegan Meal Prep Ideas",
    description: "Discover delicious and protein-packed vegan meal prep ideas that are perfect for busy weekdays. Healthy, affordable, and quick to prepare!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Healthy Eats",
    channelAvatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 543219,
    likes: 15600,
    dislikes: 320,
    duration: "15:32",
    uploadDate: "2023-03-10T00:00:00Z"
  },
  {
    id: 4,
    title: "Modern Interior Design Trends 2023",
    description: "Explore the latest interior design trends that are transforming homes in 2023. From color palettes to furniture styles, get inspired for your next home makeover!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Design Hub",
    channelAvatarUrl: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 327890,
    likes: 12300,
    dislikes: 450,
    duration: "10:15",
    uploadDate: "2023-01-25T00:00:00Z"
  },
  {
    id: 5,
    title: "Beginner's Guide to Digital Painting in Procreate",
    description: "Learn the fundamentals of digital art using Procreate on iPad. This tutorial covers all the basic tools, techniques, and workflows to get you started!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Digital Artistry",
    channelAvatarUrl: "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 421563,
    likes: 14500,
    dislikes: 380,
    duration: "25:42",
    uploadDate: "2023-02-05T00:00:00Z"
  },
  {
    id: 6,
    title: "The Science of Deep Sleep - Improve Your Sleep Quality",
    description: "Understand the science behind deep sleep and learn effective strategies to improve your sleep quality. Better sleep leads to better health and productivity!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1631157826905-e3d4f0c27a6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Health Science",
    channelAvatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 287654,
    likes: 9800,
    dislikes: 230,
    duration: "16:24",
    uploadDate: "2023-03-20T00:00:00Z"
  },
  {
    id: 7,
    title: "Build Your Own Smart Home System - DIY Guide",
    description: "Create an affordable smart home system using Raspberry Pi and open-source software. Automate lighting, climate control, security, and more!",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1558002038-1055e5298fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Tech DIY",
    channelAvatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 368902,
    likes: 13700,
    dislikes: 420,
    duration: "22:31",
    uploadDate: "2023-01-08T00:00:00Z"
  },
  {
    id: 8,
    title: "Financial Freedom in Your 30s - Investment Strategies",
    description: "Learn practical investment strategies to build wealth and achieve financial independence in your 30s. From stock market basics to real estate and retirement accounts.",
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80",
    channelName: "Wealth Builders",
    channelAvatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
    views: 493215,
    likes: 18900,
    dislikes: 520,
    duration: "19:52",
    uploadDate: "2023-02-12T00:00:00Z"
  }
];

// Sample comments data
const comments = {
  1: [
    {
      id: 1,
      videoId: 1,
      username: "WebDev_Enthusiast",
      avatarUrl: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      comment: "This tutorial was exactly what I needed to start my web development journey! The project-based approach made learning so much easier.",
      likes: 245,
      dislikes: 3,
      postedDate: "2023-01-16T15:32:00Z"
    },
    {
      id: 2,
      videoId: 1,
      username: "CodeNewbie2023",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      comment: "I've been struggling with understanding full stack development but this video explained everything so clearly. Thank you!",
      likes: 178,
      dislikes: 1,
      postedDate: "2023-01-17T08:45:00Z"
    },
    {
      id: 3,
      videoId: 1,
      username: "TechExplorer",
      avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      comment: "The section about React was particularly helpful. Would love to see a deep dive into React hooks in a future video!",
      likes: 134,
      dislikes: 2,
      postedDate: "2023-01-18T12:20:00Z"
    }
  ],
  2: [
    {
      id: 4,
      videoId: 2,
      username: "AIResearcher",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      comment: "As someone working in the field, I appreciate how accurately you explained the math behind neural networks while still making it accessible.",
      likes: 156,
      dislikes: 0,
      postedDate: "2023-02-21T10:12:00Z"
    },
    {
      id: 5,
      videoId: 2,
      username: "DataScientist101",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&h=100&q=80",
      comment: "This explanation of backpropagation is the clearest I've ever seen. Finally making sense of it all!",
      likes: 103,
      dislikes: 1,
      postedDate: "2023-02-22T15:33:00Z"
    }
  ]
};

// API endpoints
app.get('/api/videos', (req, res) => {
  res.json(videos);
});

app.get('/api/videos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const video = videos.find(v => v.id === id);
  
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  res.json(video);
});

app.get('/api/videos/:id/comments', (req, res) => {
  const id = parseInt(req.params.id);
  const videoComments = comments[id] || [];
  res.json(videoComments);
});

// Catch-all route to serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});