import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogData, VanillaDialogService } from './services/vanilla-dialog/vanilla-dialog.service';
import { LoaderService } from './services/loader/loader.service';
import { VanillaDialogComponent } from './shared/vanilla-dialog/vanilla-dialog.component';
import { ToastService } from './services/toast.service';
import { BootstrapToast, BootstrapToastComponent } from './shared/bootstrap-toast/bootstrap-toast.component';
import { LoaderComponent } from "./shared/loader/loader.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BootstrapToastComponent, VanillaDialogComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  //atributes
  showDialog = false;
  showToast = false
  dialogData: DialogData | null = null;
  toastData: BootstrapToast | null = null;
  loader = false;

  //services
  private dialogService = inject(VanillaDialogService)
  private toastSerice = inject(ToastService)
  private loaderService = inject(LoaderService)
  private cd = inject(ChangeDetectorRef)

  ngOnInit(): void {
    this.dialogService.showDialog$.subscribe((show) => {
      this.showDialog = show;
      this.cd.detectChanges()
    });

    this.dialogService.dialogData$.subscribe((data) => {
      this.dialogData = data;
    });

    //for toast
    this.toastSerice.showToast$.subscribe((show) => {
      this.showToast = show;
      this.cd.detectChanges()
    });

    this.toastSerice.toastData$.subscribe((data) => {
      this.toastData = data
    });


    this.loaderService.showLoader$.subscribe((show) => {
      this.loader = show
      this.cd.detectChanges()
    })
  }
}
