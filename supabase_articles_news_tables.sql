-- Create Articles Table
CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    author TEXT,
    category TEXT DEFAULT 'Faith',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create News Table
CREATE TABLE IF NOT EXISTS news (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Create policies for articles (public read, admin write)
CREATE POLICY "Articles are viewable by everyone" 
    ON articles FOR SELECT 
    USING (true);

CREATE POLICY "Articles are insertable by authenticated users" 
    ON articles FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Articles are updatable by authenticated users" 
    ON articles FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Articles are deletable by authenticated users" 
    ON articles FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Create policies for news (public read, admin write)
CREATE POLICY "News are viewable by everyone" 
    ON news FOR SELECT 
    USING (true);

CREATE POLICY "News are insertable by authenticated users" 
    ON news FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "News are updatable by authenticated users" 
    ON news FOR UPDATE 
    USING (auth.role() = 'authenticated');

CREATE POLICY "News are deletable by authenticated users" 
    ON news FOR DELETE 
    USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS articles_created_at_idx ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category);
CREATE INDEX IF NOT EXISTS news_created_at_idx ON news(created_at DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_articles_updated_at ON articles;
CREATE TRIGGER update_articles_updated_at 
    BEFORE UPDATE ON articles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_news_updated_at ON news;
CREATE TRIGGER update_news_updated_at 
    BEFORE UPDATE ON news 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
