import { useState, useEffect } from 'react';
import axios from 'axios';
import BlogPostCard from './BlogPostCard';

export default function NewslettersList() {
    const [newsletters, setNewsletters] = useState([]);

    useEffect(() => {
        async function fetchNewsletters() {
            try {
                const response = await axios.get('http://localhost:4000/newsletters');
                setNewsletters(response.data);
            } catch (error) {
                console.error('Error fetching newsletters', error);
            }
        }
        fetchNewsletters();
    }, []);


    const handleDeleteNewsletter = (id) => {
        setNewsletters((prevNewsletters) =>
            prevNewsletters.filter((newsletter) => newsletter._id !== id)
        );
    };

    return (
        <div>
            {newsletters.map((newsletter, index) => (
                <BlogPostCard key={newsletter._id} newsletter={newsletter} index={index} onDelete={handleDeleteNewsletter} />
            ))}
        </div>
    );
}
