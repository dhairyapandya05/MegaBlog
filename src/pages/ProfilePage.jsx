import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../components';

function ProfilePage() {
  const { profileId } = useParams();

  return (
    <div className="py-8">
      <Container>
        <div className="min-h-[400px] flex items-center justify-center bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800">
            User Profile Page
          </h1>
          {profileId && (
            <p className="text-xl text-gray-600 mt-4">Profile ID: <span className="font-mono bg-gray-100 p-1 rounded">{profileId}</span></p>
          )}
          {!profileId && (
            <p className="text-xl text-red-500 mt-4">No Profile ID Found!</p>
          )}
        </div>
      </Container>
    </div>
  );
}

export default ProfilePage;
