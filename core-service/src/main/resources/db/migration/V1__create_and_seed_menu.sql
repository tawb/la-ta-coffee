CREATE TABLE IF NOT EXISTS menu_category (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS menu_item (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    note VARCHAR(255),
    price DOUBLE PRECISION NOT NULL,
    category_id BIGINT REFERENCES menu_category(id)
);

INSERT INTO menu_category (id, name) VALUES
    (1, 'Filter'),
    (2, 'Espresso'),
    (3, 'Cold'),
    (4, 'Matcha');

INSERT INTO menu_item (id, name, note, price, category_id) VALUES
    ('filter-yirgacheffe', 'Yirgacheffe', 'Ethiopia ┬╖ washed ┬╖ jasmine, bergamot', 20, 1),
    ('filter-kirinyaga', 'Kirinyaga', 'Kenya ┬╖ washed ┬╖ blackcurrant', 22, 1),
    ('filter-narino', 'Nari├▒o', 'Colombia ┬╖ honey ┬╖ red plum', 20, 1),
    ('espresso-espresso', 'Espresso', 'Single origin, whatever is open', 10, 2),
    ('espresso-cortado', 'Cortado', 'Equal parts', 14, 2),
    ('espresso-flat-white', 'Flat White', 'Six ounces', 16, 2),
    ('espresso-mocha', 'Mocha', 'Dark, not sweet', 18, 2),
    ('asem-vip', 'The power Asem', 'Made with the best profitional barista asem', 41, 2),
    ('matari-vip', 'Matari The rain', 'Made with the best profitional barista halima', 42, 2),
    ('cold-brew', 'Cold Brew', 'Eighteen hours', 20, 3),
    ('cold-iced-latte', 'Iced Latte', 'Six ounces, over ice', 18, 3),
    ('ahmad', 'Abu Awwad', '200 OK', 10000, 3),
    ('matcha-latte', 'Matcha Latte', 'Ceremonial grade, Uji', 22, 4),
    ('matcha-chocolate', 'Chocolate Matcha', 'Layered, not stirred', 24, 4),
    ('matcha-strawberry', 'Matcha Strawberry', 'Seasonal', 24, 4),
    ('matcha-taro', 'Taro Matcha', 'Root and leaf', 24, 4),
    ('matcha-banana', 'Banana Matcha', 'Blended cold', 24, 4),
    ('matcha-caramel', 'Caramel Matcha', 'Salted', 24, 4),
    ('matcha-mango', 'Mango Matcha', 'Cold only', 24, 4);
