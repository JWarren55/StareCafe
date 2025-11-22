const foodId = new URLSearchParams(window.location.search).get('foodid');

fetch(`/api/food/${foodId}`)
  .then(res => res.json())
  .then(data => {
    document.getElementById('food-name').textContent = data.name;
    document.getElementById('food-image').src = data.image;
    document.getElementById('nutrition-info').textContent = data.nutrition;
  });

document.getElementById('thumb-up').onclick = () => sendRating('upvote');
document.getElementById('thumb-down').onclick = () => sendRating('downvote');

function sendRating(type) {
  fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foodid: foodId, rating: type })
  });
}

document.getElementById('view-comments').onclick = () => {
  document.getElementById('comments-section').style.display = 'block';
  fetch(`/api/comments/${foodId}`)
    .then(res => res.json())
    .then(comments => {
      const list = document.getElementById('comments-list');
      list.innerHTML = '';
      comments.forEach(c => {
        const div = document.createElement('div');
        div.textContent = c.comment;
        list.appendChild(div);
      });
    });
};

document.getElementById('submit-comment').onclick = () => {
  const comment = document.getElementById('new-comment').value;
  fetch('/api/feedback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ foodid: foodId, comment })
  });
};