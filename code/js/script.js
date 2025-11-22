const menuList = document.getElementById('menu-list');
const mealTitle = document.getElementById('meal-title');
const searchBar = document.getElementById('search-bar');

let menuData = [];

function getMealType() {
  const hour = new Date().getHours();
  if (hour < 10) return 'breakfast';
  if (hour < 15) return 'lunch';
  return 'dinner';
}

function displayMenu(items) {
  menuList.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.textContent = item.name;
    div.onclick = () => window.location.href = `food.html?foodid=${item.foodid}`;
    menuList.appendChild(div);
  });
}

fetch('/api/menu')
  .then(res => res.json())
  .then(data => {
    menuData = data;
    const mealType = getMealType();
    mealTitle.textContent = `Today's ${mealType} Menu`;
    const filtered = data.filter(item => item.mealType === mealType);
    displayMenu(filtered);
  });

searchBar.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  const results = menuData.filter(item => item.name.toLowerCase().includes(query));
  displayMenu(results);
});