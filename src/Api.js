export async function fetchCategories() {
    const res = await fetch('https://dummyjson.com/products/categories');
    return res.json();
}