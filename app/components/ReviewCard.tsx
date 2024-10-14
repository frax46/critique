import { FaStar } from 'react-icons/fa';

interface ReviewCardProps {
  review: {
    id: string;
    text: string;
    rating: number;
    user: {
      name: string;
    };
    question: {
      text: string;
    };
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="bg-white bg-opacity-90 rounded-lg p-4 shadow-lg max-w-sm">
      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
        ))}
      </div>
      <p className="text-gray-800 mb-2">{review.text}</p>
      <p className="text-sm text-gray-600">- {review.user.name}</p>
      <p className="text-xs text-gray-500 mt-1">On: {review.question.text}</p>
    </div>
  );
};

export default ReviewCard;
