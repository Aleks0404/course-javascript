export const getReviews = () => {
  const reviews = localStorage.reviews; // функция getReviews для получения всех отзывов из localStorage
  return JSON.parse(reviews || '[]');
};

export const addReview = (review) => {
  localStorage.reviews = JSON.stringify([...getReviews(), review]); //функция для записи в localStoragе нового отзыва
};
