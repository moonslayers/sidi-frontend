import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { Login } from './login';
import { AuthService } from '../../services/auth.service';
import { Login as LoginModel } from '../../models/login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty rfc and password', () => {
    expect(component.rfc).toBe('');
    expect(component.password).toBe('');
    expect(component.loading).toBeFalse();
  });

  it('should call authService.login with correct credentials and navigate on success', async () => {
    // Arrange
    const mockLoginResponse: LoginModel = {
      message: 'Login successful',
      user: { id: 1, rfc: 'TEST123', user_type: 'INTERNO', name: 'Test User', email: 'test@test.com' },
      token: 'mock-token',
      token_type: 'Bearer',
      expires_at: new Date(),
      expires_in_minutes: 60
    };

    component.rfc = 'TEST123456XYZ';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(Promise.resolve(mockLoginResponse));

    // Act
    await component.submit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      rfc: 'TEST123456XYZ',
      password: 'password123'
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/main/dashboard']);
    expect(component.loading).toBeFalse();
  });

  it('should not navigate when login returns null', async () => {
    // Arrange
    component.rfc = 'TEST123456XYZ';
    component.password = 'wrongpassword';
    authServiceSpy.login.and.returnValue(Promise.resolve(null));

    // Act
    await component.submit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      rfc: 'TEST123456XYZ',
      password: 'wrongpassword'
    });
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should handle login errors gracefully', async () => {
    // Arrange
    component.rfc = 'TEST123456XYZ';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(Promise.reject('Network error'));

    // Act
    await component.submit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      rfc: 'TEST123456XYZ',
      password: 'password123'
    });
    expect(routerSpy.navigate).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should set loading to true during login process', async () => {
    // Arrange
    component.rfc = 'TEST123456XYZ';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(new Promise(resolve => {
      setTimeout(() => resolve({} as LoginModel), 100);
    }));

    // Act
    const submitPromise = component.submit();

    // Assert - loading should be true immediately
    expect(component.loading).toBeTrue();

    // Wait for completion
    await submitPromise;
    expect(component.loading).toBeFalse();
  });

  it('should convert RFC to uppercase before sending', async () => {
    // Arrange
    const mockLoginResponse: LoginModel = {
      message: 'Login successful',
      user: { id: 1, rfc: 'TEST123456XYZ', user_type: 'INTERNO', name: 'Test User', email: 'test@test.com' },
      token: 'mock-token',
      token_type: 'Bearer',
      expires_at: new Date(),
      expires_in_minutes: 60
    };

    component.rfc = 'test123456xyz'; // lowercase RFC
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(Promise.resolve(mockLoginResponse));

    // Act
    await component.submit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      rfc: 'TEST123456XYZ', // Should be uppercase
      password: 'password123'
    });
  });

  it('should handle RFC with special characters correctly', async () => {
    // Arrange
    const mockLoginResponse: LoginModel = {
      message: 'Login successful',
      user: { id: 1, rfc: 'ÑÑA800101', user_type: 'INTERNO', name: 'Test User', email: 'test@test.com' },
      token: 'mock-token',
      token_type: 'Bearer',
      expires_at: new Date(),
      expires_in_minutes: 60
    };

    component.rfc = 'ñña800101';
    component.password = 'password123';
    authServiceSpy.login.and.returnValue(Promise.resolve(mockLoginResponse));

    // Act
    await component.submit();

    // Assert
    expect(authServiceSpy.login).toHaveBeenCalledWith({
      rfc: 'ÑÑA800101', // Should maintain Ñ character
      password: 'password123'
    });
  });

  it('should handle empty RFC gracefully', async () => {
    // Arrange
    component.rfc = '';
    component.password = 'password123';

    // Act
    await component.submit();

    // Assert - AuthService should not be called with empty RFC
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should handle empty password gracefully', async () => {
    // Arrange
    component.rfc = 'TEST123456XYZ';
    component.password = '';

    // Act
    await component.submit();

    // Assert - AuthService should not be called with empty password
    expect(authServiceSpy.login).not.toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });
});
