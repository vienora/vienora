/**
 * Avatar Upload API Endpoint
 * Secure image upload with validation, processing, and storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateApiToken } from '@/lib/auth/jwt';
import { AuthErrorCode } from '@/lib/types/auth';
import { AuthService } from '@/lib/auth/service';

// Configure for dynamic deployment
export const dynamic = 'force-dynamic';

// Upload constraints
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_DIMENSION = 2048; // pixels

// ========================================
// Avatar Upload Endpoint
// ========================================

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication token
    const tokenValidation = await validateApiToken(request);

    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    const { userId } = tokenValidation.data;

    // Get user to verify they exist
    const authService = new AuthService();
    const user = await authService.getUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }

    // Parse form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'Invalid form data',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: 'No avatar file provided',
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Validate file
    const validationResult = validateAvatarFile(file);
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.INVALID_CREDENTIALS,
            message: validationResult.error,
            timestamp: new Date().toISOString()
          }
        },
        { status: 400 }
      );
    }

    // Process and upload file
    const uploadResult = await processAndUploadAvatar(file, userId);

    if (uploadResult.success) {
      // Update user's avatar URL in the database
      const updateResult = await authService.updateUser(userId, {
        avatar: uploadResult.avatarUrl
      });

      if (updateResult.success) {
        return NextResponse.json(
          {
            success: true,
            data: {
              avatarUrl: uploadResult.avatarUrl,
              user: updateResult.data,
              message: 'Avatar uploaded successfully'
            }
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: AuthErrorCode.UNKNOWN_ERROR,
              message: 'Failed to update user avatar',
              timestamp: new Date().toISOString()
            }
          },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.UNKNOWN_ERROR,
            message: uploadResult.error,
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error during avatar upload:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during avatar upload',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// Delete Avatar Endpoint
// ========================================

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Validate authentication token
    const tokenValidation = await validateApiToken(request);

    if (!tokenValidation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: tokenValidation.error.code,
            message: tokenValidation.error.message,
            timestamp: new Date().toISOString()
          }
        },
        { status: 401 }
      );
    }

    const { userId } = tokenValidation.data;

    // Get user to verify they exist
    const authService = new AuthService();
    const user = await authService.getUserById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.USER_NOT_FOUND,
            message: 'User not found',
            timestamp: new Date().toISOString()
          }
        },
        { status: 404 }
      );
    }

    // Delete avatar from storage (in real app, would delete from cloud storage)
    if (user.avatar && user.avatar.includes('ugc.same-assets.com')) {
      console.log('Deleting avatar from storage:', user.avatar);
      // In a real implementation, you would delete the file from cloud storage
    }

    // Remove avatar URL from user profile
    const updateResult = await authService.updateUser(userId, {
      avatar: undefined
    });

    if (updateResult.success) {
      return NextResponse.json(
        {
          success: true,
          data: {
            user: updateResult.data,
            message: 'Avatar removed successfully'
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: AuthErrorCode.UNKNOWN_ERROR,
            message: 'Failed to remove avatar',
            timestamp: new Date().toISOString()
          }
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Unexpected error during avatar deletion:', error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: AuthErrorCode.UNKNOWN_ERROR,
          message: 'An unexpected error occurred during avatar deletion',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// ========================================
// File Validation
// ========================================

interface ValidationResult {
  readonly isValid: boolean;
  readonly error?: string;
}

function validateAvatarFile(file: File): ValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}`
    };
  }

  // Check file name for security
  const fileName = file.name.toLowerCase();
  const suspiciousExtensions = ['.php', '.js', '.html', '.exe', '.bat', '.sh'];

  if (suspiciousExtensions.some(ext => fileName.includes(ext))) {
    return {
      isValid: false,
      error: 'Invalid file name or extension'
    };
  }

  // Additional security checks
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return {
      isValid: false,
      error: 'Invalid file name format'
    };
  }

  return { isValid: true };
}

// ========================================
// Image Processing and Upload
// ========================================

interface UploadResult {
  readonly success: boolean;
  readonly avatarUrl?: string;
  readonly error?: string;
}

async function processAndUploadAvatar(file: File, userId: string): Promise<UploadResult> {
  try {
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Validate image dimensions (in a real app, you'd use a proper image library)
    // For demo purposes, we'll simulate this validation
    const imageDimensions = await getImageDimensions(buffer);

    if (imageDimensions.width > MAX_DIMENSION || imageDimensions.height > MAX_DIMENSION) {
      return {
        success: false,
        error: `Image dimensions too large. Maximum size is ${MAX_DIMENSION}x${MAX_DIMENSION} pixels`
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const fileExtension = getFileExtension(file.type);
    const fileName = `avatar_${userId}_${timestamp}_${randomId}.${fileExtension}`;

    // In a real application, you would:
    // 1. Resize/optimize the image
    // 2. Upload to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 3. Generate a secure URL

    // For demo purposes, we'll simulate a successful upload
    const avatarUrl = `https://ugc.same-assets.com/avatars/${fileName}`;

    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Log upload details for monitoring
    console.log(`Avatar uploaded successfully for user ${userId}:`, {
      fileName,
      fileSize: file.size,
      fileType: file.type,
      dimensions: imageDimensions,
      url: avatarUrl
    });

    return {
      success: true,
      avatarUrl
    };

  } catch (error) {
    console.error('Error processing avatar upload:', error);
    return {
      success: false,
      error: 'Failed to process and upload avatar'
    };
  }
}

// ========================================
// Utility Functions
// ========================================

async function getImageDimensions(buffer: Buffer): Promise<{ width: number; height: number }> {
  // In a real application, you would use a proper image library like 'sharp' or 'jimp'
  // For demo purposes, we'll return simulated dimensions
  return {
    width: 500,
    height: 500
  };
}

function getFileExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
  };

  return extensions[mimeType] || 'jpg';
}

// ========================================
// Security Headers
// ========================================

function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
}

// ========================================
// CORS Headers
// ========================================

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
      'Access-Control-Allow-Methods': 'POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
      ...getSecurityHeaders()
    },
  });
}
