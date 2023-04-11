import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const NewslettersContext = createContext();

export const NewslettersProvider = ({ children }) => {
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
        <NewslettersContext.Provider value={{ newsletters, handleDeleteNewsletter }}>
            {children}
        </NewslettersContext.Provider>
    );
};
