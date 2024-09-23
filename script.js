// Fetching events from JSON server
let eventsData = [];
let favorites = [];

// Load events from the JSON server
window.onload = () => {
  fetch('http://localhost:3000/events')
    .then(response => response.json())
    .then(data => {
      eventsData = data;
      renderEvents(eventsData);
    })
    .catch(error => console.error('Error fetching events:', error));
};

// Function to render events on the page
function renderEvents(events) {
  const eventsContainer = document.getElementById('eventsContainer');
  eventsContainer.innerHTML = ''; // Clear previous events

  events.forEach(event => {
    const eventCard = document.createElement('div');
    eventCard.classList.add('event-card');
    eventCard.innerHTML = `
      <img src="${event.imageUrl}" alt="${event.title}">
      <div>
        <h3>${event.title}</h3>
        <p>Location: ${event.location}</p>
        <p>Date: ${event.date}</p>
        <p>Price: $${event.price}</p>
        <button onclick="addToFavorites(${event.id})">Add to Favorites</button>
      </div>
    `;
    eventsContainer.appendChild(eventCard);
  });
}

// Function to add an event to the favorites list
function addToFavorites(eventId) {
  const event = eventsData.find(event => event.id === eventId);

  // Check if the event is already in the favorites list
  if (favorites.some(fav => fav.id === event.id)) {
    alert('Event is already in favorites.');
    return; // Exit the function if the event is already in the list
  }

  // Add the event to the favorites list and render it
  favorites.push(event);
  renderFavorites();
}

// Function to render the favorites list
function renderFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  favoritesList.innerHTML = ''; // Clear previous favorites

  favorites.forEach(fav => {
    const li = document.createElement('li');
    li.textContent = fav.title;
    
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => removeFromFavorites(fav.id);
    
    li.appendChild(removeBtn);
    favoritesList.appendChild(li);
  });
}

// Function to remove an event from the favorites list
function removeFromFavorites(eventId) {
  favorites = favorites.filter(fav => fav.id !== eventId);
  renderFavorites(); // Re-render the updated favorites list
}

// Filter events by price or location
function applyFilter() {
  const filterBy = document.getElementById('filterBy').value;
  const filterValue = document.getElementById('filterValue').value.toLowerCase();

  let filteredEvents;

  if (filterBy === 'price') {
    filteredEvents = eventsData.filter(event => event.price <= parseFloat(filterValue));
  } else if (filterBy === 'location') {
    filteredEvents = eventsData.filter(event => event.location.toLowerCase().includes(filterValue));
  } else {
    filteredEvents = eventsData; // If no filter is selected, show all events
  }

  renderEvents(filteredEvents);
}

// Lazy load images for performance optimization
function lazyLoadImages() {
  const images = document.querySelectorAll('img');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        observer.unobserve(img);
      }
    });
  });

  images.forEach(image => {
    image.dataset.src = image.src;
    image.src = ''; // Lazy loading placeholder
    observer.observe(image);
  });
}

window.onload = () => {
  fetch('http://localhost:3000/events')
    .then(response => response.json())
    .then(data => {
      eventsData = data;
      renderEvents(eventsData);
      lazyLoadImages(); // Lazy load images
    })
    .catch(error => console.error('Error fetching events:', error));
};
