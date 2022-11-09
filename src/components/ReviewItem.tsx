import useReviewDetails from '../hooks/useReviewDetails';
import { IReview } from '../types';

function ReviewItem({ review }: { review: IReview }) {
  const reviewDetail = useReviewDetails(review.uri);

  if (!reviewDetail) {
    return null;
  }

  return (
    <div className='flex flex-row gap-2 rounded-xl p-4 border border-gray-200  w-full'>
      <div className='flex flex-col items-top justify-between gap-4'>
        <div className='flex flex-col justify-start items-start gap-4'>
          <div className='flex items-center justify-start w-full  relative'>
            <img
              src={`/default-avatar-${Number(review.to.id) % 11}.jpeg`}
              className='w-10 mr-4 rounded-full'
            />
            <div className='flex flex-col'>
              <p className='text-gray-900 font-medium'>{review.to.handle}</p>
              <p className='text-xs text-gray-500'>
                Review created the 09/22
                {/* {formatDate(Number(review.createdAt) * 1000)} */}
              </p>
            </div>
          </div>

          <div className=' border-t border-gray-100 w-full'>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Rating:</strong> {reviewDetail.rating}
            </p>
            <p className='text-sm text-gray-500 mt-4'>
              <strong>Message:</strong> {reviewDetail.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewItem;
