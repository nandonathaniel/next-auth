import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import styles from '@/styles/Home.module.css';
import Link from 'next/link';

const Dashboard = () => {
  const { data, status } = useSession();
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (data?.accessToken && status === 'authenticated') {
        const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
          headers: {
            Authorization: `Bearer ${data.accessToken}`,
          },
        });

        if (!response.ok) {
          console.error('Failed to fetch profile picture:', response.statusText);
          return;
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProfilePicture(imageUrl);
      }
    };

    fetchProfilePicture();
  }, [data?.accessToken, status]);

  console.log("Session data:", data?.user);

  return status === 'authenticated' ? (
    <div style={{ textAlign: 'center' }}>
      <h1>Dashboard</h1>
      {data && (
        <>
          {profilePicture && (
            <img
              src={profilePicture}
              alt="User Avatar"
              style={{ borderRadius: '50%', width: '100px', height: '100px' }}
            />
          )}
          <div>{`Name : ${data.user?.name}`}</div>
          <div>{`Email : ${data.user?.email}`}</div>
          <div>{`Token: ${data.accessToken}`}</div>
        </>
      )}
      <button className={styles.actionButton} onClick={() => signOut({ callbackUrl: '/' })}>
        Log out
      </button>
    </div>
  ) : (
    <Link href="/">Log in</Link>
  );
};

export default Dashboard;