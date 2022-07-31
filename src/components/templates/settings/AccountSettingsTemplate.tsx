import { DeleteAccountModal } from '@components/molecules/modals';
import React, { useState } from 'react';

const AccountSettingsTemplate: React.FC = () => {
  // states
  const [deleteAccountModal, setDeleteAccountModal] = useState<boolean>(false);

  return (
    <>
      <DeleteAccountModal
        isOpen={deleteAccountModal}
        setIsOpen={setDeleteAccountModal}
      />

      <div>
        <h1>Account settings</h1>

        <h3>Delete account</h3>
        <p>
          Are you sure you want to delete your account? All data will be
          deleted. This action cannot be undone.
        </p>
        <button
          className="btn-danger"
          onClick={() => setDeleteAccountModal(true)}
        >
          Delete account
        </button>
      </div>
    </>
  );
};

export default AccountSettingsTemplate;
