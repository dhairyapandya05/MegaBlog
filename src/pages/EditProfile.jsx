import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Input, Button } from '../components';
import firebaseService from '../appwrite/config'; // Your Firebase service
import { useForm } from 'react-hook-form';

function EditProfile() {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [loading, setLoading] = useState(true);
  const [currentProfileData, setCurrentProfileData] = useState(null);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        // Check if user is authorized to edit this profile
        if (userData && userData.uid === profileId) {
          // Fetch user profile data from Firestore
          const userDoc = await firebaseService.getUserProfile(profileId);
          if (userDoc) {
            setCurrentProfileData({
              name: userDoc.name || userData.displayName || '',
              email: userDoc.email || userData.email || '',
              designation: userDoc.designation || 'Software Engineer',
              location: userDoc.location || 'Jamnagar, Gujarat',
              website: userDoc.website || 'https://example.com',
              github: userDoc.github || '',
              twitter: userDoc.twitter || '',
              education: userDoc.education || 'Charotar University of Science and Technology, CHARUSAT',
              work: userDoc.work || 'Student',
              skills: userDoc.skills || ['React', 'Node.js', 'Firebase', 'Tailwind CSS'],
              profilePic: userDoc.profilePic || userData.profilePic || 'https://avatar.iran.liara.run/username?username=' + (userData.displayName || 'Anonymous'),
            });
            // Set form values
            setValue('name', userDoc.name || userData.displayName || '');
            setValue('email', userDoc.email || userData.email || '');
            setValue('designation', userDoc.designation || 'Software Engineer');
            setValue('location', userDoc.location || 'Jamnagar, Gujarat');
            setValue('website', userDoc.website || 'https://example.com');
            setValue('github', userDoc.github || '');
            setValue('twitter', userDoc.twitter || '');
            setValue('education', userDoc.education || 'Charotar University of Science and Technology, CHARUSAT');
            setValue('work', userDoc.work || 'Student');
            setValue('skills', Array.isArray(userDoc.skills) ? userDoc.skills.join(', ') : 'React, Node.js, Firebase, Tailwind CSS');
          }
        } else {
          // Redirect if not authorized to edit this profile
          navigate('/profile/' + (userData?.id || ''));
        }
      } catch (error) {
        console.error('Error fetching profile data for edit:', error);
        navigate('/profile/' + (userData?.id || '')); // Redirect on error
      }
      setLoading(false);
    };

    fetchProfileData();
  }, [profileId, userData, navigate, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Convert skills string to array
      const profileData = {
        ...data,
        skills: data.skills.split(',').map(skill => skill.trim()),
      };
      
      // Update user profile in Firestore
      await firebaseService.updateUserProfile(profileId, profileData);
      alert('Profile Updated Successfully!');
      navigate(`/profile/${profileId}`);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
    setLoading(false);
  };

  if (loading || !currentProfileData) {
    return (
      <div className="py-8 flex items-center justify-center min-h-[500px] bg-white">
        <p className="text-lg font-medium text-gray-700">Loading profile data for edit...</p>
      </div>
    );
  }

  return (
    <div className="py-6 bg-white min-h-screen">
      <Container>
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Edit Profile</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name:"
              placeholder="Your Name"
              {...register('name', { required: true })}
            />
            <Input
              label="Email:"
              type="email"
              placeholder="Your Email"
              {...register('email', { required: true, pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ })}
              disabled
            />
            <Input
              label="Designation:"
              placeholder="e.g., Software Engineer"
              {...register('designation')}
            />
            <Input
              label="Location:"
              placeholder="e.g., Jamnagar, Gujarat"
              {...register('location')}
            />
            <Input
              label="Website:"
              placeholder="https://yourwebsite.com"
              {...register('website')}
            />
            <Input
              label="GitHub Username:"
              placeholder="your_github_username"
              {...register('github')}
            />
            <Input
              label="Twitter Username:"
              placeholder="your_twitter_username"
              {...register('twitter')}
            />
            <Input
              label="Education:"
              placeholder="e.g., University Name, Degree"
              {...register('education')}
            />
            <Input
              label="Work:"
              placeholder="e.g., Company Name, Role"
              {...register('work')}
            />
            <Input
              label="Skills (comma-separated):"
              placeholder="e.g., React, Node.js, Firebase"
              {...register('skills')}
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Save Changes
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}

export default EditProfile; 