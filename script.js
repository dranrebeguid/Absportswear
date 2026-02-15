// ===== SECTION NAVIGATION =====
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const sectionId = link.getAttribute('data-section');
    showSection(sectionId);
    closeMenu();
  });
});

function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });

  // Show the selected section
  document.getElementById(sectionId).classList.add('active');

  // Stop gallery autoplay if we're leaving portfolio
  if (sectionId !== 'portfolio') {
    clearInterval(galleryAutoplayInterval);
  } else {
    startGalleryAutoplay();
  }
}

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  navMenu.classList.toggle('active');
});

function closeMenu() {
  navMenu.classList.remove('active');
}

// ===== CLIENT CAROUSEL =====
let carouselCurrentIndex = 0;
const carouselClientImages = [];
let carouselAutoplayInterval;

async function loadClientCarouselImages() {
  try {
    const clientNames = ['client1.png', 'client2.png', 'client3.png', 'client4.jpeg', 'client5.jpeg'];
    
    const carouselTrack = document.getElementById('carouselTrack');
    carouselTrack.innerHTML = '';

    // Load client images from the folder - doubled for seamless loop
    clientNames.forEach((imageName, index) => {
      const img = document.createElement('div');
      img.className = 'carousel-item';
      img.innerHTML = `<img src="images/clientCarousel/${imageName}" alt="Client ${index + 1}">`;
      carouselTrack.appendChild(img);
      carouselClientImages.push(imageName);
    });

    // Duplicate items for seamless loop
    clientNames.forEach((imageName, index) => {
      const img = document.createElement('div');
      img.className = 'carousel-item';
      img.innerHTML = `<img src="images/clientCarousel/${imageName}" alt="Client ${index + 1}">`;
      carouselTrack.appendChild(img);
    });

    // If no images found, show placeholder
    if (carouselClientImages.length === 0) {
      carouselTrack.innerHTML = '<p style="color: #999; padding: 20px;">No client images found</p>';
    } else {
      startCarouselAutoplay();
    }
  } catch (error) {
    console.log('Client carousel images error:', error);
  }
}

function updateCarouselPosition(instant = false) {
  const track = document.getElementById('carouselTrack');
  const items = track.querySelectorAll('.carousel-item');
  if (items.length === 0) return;
  const itemWidth = items[0].offsetWidth + 20; // 20px gap
  
  if (instant) {
    track.style.transition = 'none';
  } else {
    track.style.transition = 'transform 0.5s ease';
  }
  
  track.style.transform = `translateX(-${carouselCurrentIndex * itemWidth}px)`;
}

function startCarouselAutoplay() {
  if (carouselClientImages.length <= 1) return;
  
  clearInterval(carouselAutoplayInterval);
  carouselAutoplayInterval = setInterval(() => {
    const items = document.querySelectorAll('.carousel-item');
    const totalOriginalItems = carouselClientImages.length;
    
    carouselCurrentIndex++;
    updateCarouselPosition(false);
    
    // When we reach the duplicated items, seamlessly loop back
    if (carouselCurrentIndex >= totalOriginalItems) {
      setTimeout(() => {
        carouselCurrentIndex = 0;
        updateCarouselPosition(true);
      }, 500); // Match the transition duration
    }
  }, 3000);
}

// ===== GALLERY =====
let galleryCurrentIndex = 0;
const galleryImages = [];
let galleryAutoplayInterval;

async function loadGalleryImages() {
  try {
    // Load gallery images - using the actual slide filenames
    const slideNames = [
      'slide01.jpg', 'slide02.jpg', 'slide03.jpg', 'slide04.jpg', 'slide05.jpg',
      'slide06.jpg', 'slide07.jpg', 'slide08.jpg', 'slide09.jpg', 'slide10.jpg',
      'slide11.jpg', 'slide12.jpg', 'slide13.jpg', 'slide14.jpg', 'slide15.jpg',
      'slide16.jpg', 'slide17.jpg', 'slide19.jpg', 'slide20.jpg', 'slide21.jpg',
      'slide22.jpg', 'slide23.jpg', 'slide24.jpg'
    ];

    slideNames.forEach(imageName => {
      galleryImages.push(imageName);
    });

    document.getElementById('totalSlides').textContent = galleryImages.length;

    // Set initial image
    if (galleryImages.length > 0) {
      updateGalleryImage();
    } else {
      document.getElementById('galleryImage').src = '';
      document.getElementById('totalSlides').textContent = '0';
    }
  } catch (error) {
    console.log('Gallery images error:', error);
  }
}

function updateGalleryImage() {
  if (galleryImages.length === 0) return;
  
  document.getElementById('galleryImage').src = `images/gallery/${galleryImages[galleryCurrentIndex]}`;
  document.getElementById('currentSlide').textContent = galleryCurrentIndex + 1;
}

document.getElementById('galleryNext').addEventListener('click', () => {
  if (galleryImages.length > 0) {
    galleryCurrentIndex = (galleryCurrentIndex + 1) % galleryImages.length;
    updateGalleryImage();
  }
});

document.getElementById('galleryPrev').addEventListener('click', () => {
  if (galleryImages.length > 0) {
    galleryCurrentIndex = (galleryCurrentIndex - 1 + galleryImages.length) % galleryImages.length;
    updateGalleryImage();
  }
});

function startGalleryAutoplay() {
  if (galleryImages.length <= 1) return;
  
  clearInterval(galleryAutoplayInterval);
  galleryAutoplayInterval = setInterval(() => {
    galleryCurrentIndex = (galleryCurrentIndex + 1) % galleryImages.length;
    updateGalleryImage();
  }, 4000);
}

// ===== CALCULATOR =====
const quantityInput = document.getElementById('quantity');
const apparelTypeSelect = document.getElementById('apparel-type');
const locationSelect = document.getElementById('location');

const PRICES = {
  jersey: 350,
  'full-set': 500
};

const SHIPPING = {
  bacolod: 200,
  negros: 400,
  outside: 500
};

function updateCalculator() {
  const quantity = parseInt(quantityInput.value) || 1;
  const apparelType = apparelTypeSelect.value;
  const location = locationSelect.value;

  const unitPrice = PRICES[apparelType];
  const subtotal = quantity * unitPrice;
  const freePieces = Math.floor(quantity / 15);
  const shipping = SHIPPING[location];
  const total = subtotal + shipping;

  // Update display
  document.getElementById('unitPrice').textContent = `₱${unitPrice}`;
  document.getElementById('subtotal').textContent = `₱${subtotal}`;
  document.getElementById('freePieces').textContent = freePieces;
  document.getElementById('shipping').textContent = `₱${shipping}`;
  document.getElementById('totalEstimate').textContent = `₱${total}`;
}

quantityInput.addEventListener('change', updateCalculator);
quantityInput.addEventListener('input', updateCalculator);
apparelTypeSelect.addEventListener('change', updateCalculator);
locationSelect.addEventListener('change', updateCalculator);

document.getElementById('inquireBtn').addEventListener('click', (e) => {
  e.preventDefault();
  
  const quantity = document.getElementById('quantity').value;
  const apparelType = document.getElementById('apparel-type').value;
  const location = document.getElementById('location').value;
  const totalEstimate = document.getElementById('totalEstimate').textContent;

  // Populate inquiry field and navigate to contact
  document.getElementById('inquiry').value = `I'm interested in ordering:\n- Quantity: ${quantity} pieces\n- Type: ${apparelType === 'jersey' ? 'Jersey (Upper Shirt Only)' : 'Full Set (Jersey + Shorts)'}\n- Location: ${location === 'bacolod' ? 'Bacolod City' : location === 'negros' ? 'Within Negros' : 'Outside Negros'}\n- Estimated Total: ${totalEstimate}`;

  showSection('contact');
  document.querySelector('.form-wrapper').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// ===== CONTACT FORM =====
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const company = document.getElementById('company').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const inquiry = document.getElementById('inquiry').value.trim();

  // Validate
  if (!name || !phone || !email || !inquiry) {
    alert('Please fill in all required fields (marked with *)');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address');
    return;
  }

  const phoneRegex = /^[0-9\-\+\s()]+$/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid phone number');
    return;
  }

  // Success message
  alert(
    'Thank you for your inquiry!' +
    '\n\nOur team will contact you soon.' +
    '\n\nDetails:\n' +
    'Name: ' + name +
    '\nCompany: ' + company +
    '\nPhone: ' + phone +
    '\nEmail: ' + email +
    '\n\nInquiry: ' + inquiry
  );

  this.reset();
});

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  loadClientCarouselImages();
  loadGalleryImages();
  updateCalculator();
  showSection('home');
});
