interface CategoryFeature {
  text: string;
}

interface CategoryCard {
  icon: string;
  title: string;
  description: string[];
  features: CategoryFeature[];
  buttonText: string;
}

export default CategoryCard;
