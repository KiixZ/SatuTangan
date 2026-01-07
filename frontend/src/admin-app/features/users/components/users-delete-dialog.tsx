'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { showSubmittedData } from '@admin/lib/show-submitted-data'
import { Alert, AlertDescription, AlertTitle } from '@admin/components/ui/alert'
import { Input } from '@admin/components/ui/input'
import { Label } from '@admin/components/ui/label'
import { ConfirmDialog } from '@admin/components/confirm-dialog'
import { type User } from '../data/schema'

type UserDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: User
}

export function UsersDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: UserDeleteDialogProps) {
  const [value, setValue] = useState('')
  const identifierToConfirm = currentRow.username || currentRow.email

  const handleDelete = () => {
    if (value.trim() !== identifierToConfirm) return

    onOpenChange(false)
    showSubmittedData(currentRow, 'The following user has been deleted:')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== identifierToConfirm}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete User
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Are you sure you want to delete{' '}
            <span className='font-bold'>
              {currentRow.username || currentRow.email}
            </span>
            ?
            <br />
            This action will permanently remove the user with the role of{' '}
            <span className='font-bold'>
              {Array.isArray(currentRow.role)
                ? currentRow.role.join(', ')
                : currentRow.role}
            </span>{' '}
            from the system. This cannot be undone.
          </p>

          <Label className='my-2'>
            {currentRow.username ? 'Username' : 'Email'}:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${currentRow.username ? 'username' : 'email'} to confirm deletion.`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Warning!</AlertTitle>
            <AlertDescription>
              Please be careful, this operation can not be rolled back.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
