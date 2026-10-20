import { prisma } from '../../lib/prisma.js';
<<<<<<< HEAD
import { AppException } from './common/exceptions/app.exception.js';
=======
import CustomError from '../../utils/exception.utils.js';
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)

export class SettingsService {
  async getAllSettings(userId: string, isAdmin: boolean): Promise<any> {
    const [userSettings, systemSettings] = await Promise.all([
      this.fetchUserSettings(userId),
      this.fetchSystemSettings(),
    ]);

    if (isAdmin) {
      return { preferences: userSettings, system: systemSettings };
    }

    return { preferences: userSettings };
  }

  async getSettingByKey(userId: string, key: string, isAdmin: boolean): Promise<any> {
    const userSettings = await this.fetchUserSettings(userId);
    const systemSettings = await this.fetchSystemSettings();

    if (key in userSettings) {
      return { key, value: userSettings[key] };
    }

    if (isAdmin && key in systemSettings) {
      return { key, value: systemSettings[key] };
    }

<<<<<<< HEAD
    throw new AppException('Setting not found', 404);
=======
    throw new CustomError(404, 'Setting not found');
>>>>>>> 9e93ce4 (feat: implement resume and settings modules with CRUD operations, update dashboard routes, and enhance user profile endpoints)
  }

  async patchUserSettings(userId: string, updates: any): Promise<any> {
    await prisma.setting.deleteMany({ where: { userId, type: 'user' } });

    const newSettings: any[] = [];
    for (const [key, value] of Object.entries(updates)) {
      newSettings.push({ userId, key, value: String(value), type: 'user' });
    }

    if (newSettings.length > 0) {
      await prisma.setting.createMany({ data: newSettings });
    }

    return this.fetchUserSettings(userId);
  }

  async putUserSettings(userId: string, settings: any): Promise<any> {
    await prisma.setting.deleteMany({ where: { userId, type: 'user' } });

    const newSettings: any[] = [];
    for (const [key, value] of Object.entries(settings)) {
      newSettings.push({ userId, key, value: String(value), type: 'user' });
    }

    if (newSettings.length > 0) {
      await prisma.setting.createMany({ data: newSettings });
    }

    return this.fetchUserSettings(userId);
  }

  async patchSystemSettings(updates: any): Promise<any> {
    await prisma.setting.deleteMany({ where: { type: 'system' } });

    const newSettings: any[] = [];
    for (const [key, value] of Object.entries(updates)) {
      newSettings.push({ key, value: String(value), type: 'system' });
    }

    if (newSettings.length > 0) {
      await prisma.setting.createMany({ data: newSettings });
    }

    return this.fetchSystemSettings();
  }

  private async fetchUserSettings(userId: string): Promise<any> {
    const rows = await prisma.setting.findMany({
      where: { userId, type: 'user' },
    });

    const settings: any = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return {
      theme: settings.theme || 'light',
      language: settings.language || 'en',
      notifications_email: settings.notifications_email !== 'false',
      notifications_browser: settings.notifications_browser !== 'false',
      default_application_status: settings.default_application_status || 'APPLIED',
      pagination_size: Number(settings.pagination_size) || 10,
    };
  }

  private async fetchSystemSettings(): Promise<any> {
    const rows = await prisma.setting.findMany({
      where: { type: 'system' },
    });

    const settings: any = {};
    for (const row of rows) {
      settings[row.key] = row.value;
    }

    return {
      app_name: settings.app_name || 'Apply Flow',
      app_logo_url: settings.app_logo_url || '',
      timezone: settings.timezone || 'UTC',
      date_format: settings.date_format || 'MM/DD/YYYY',
      smtp_host: settings.smtp_host || '',
      smtp_port: settings.smtp_port || '587',
      smtp_user: settings.smtp_user || '',
      smtp_pass: settings.smtp_pass ? '**hidden**' : '',
    };
  }
}
