import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild, inject, OnInit, OnChanges } from '@angular/core';
import { ApiServiceService } from '../../services/api/api-service.service';

import { GenericRecord } from '../generic-form/generic-form.component';
import { UtilsService } from '../../services/utils.service';
import { firstValueFrom } from 'rxjs';
import { VanillaDialogService } from '../../services/vanilla-dialog/vanilla-dialog.service';
import { FormsModule } from '@angular/forms';

export interface FileInput{
  accept:string;
  label?:string;
  multiple?:boolean;
  key:string;
  fileKey:string;
  apiUrl:string;
  value?:string;
  foreign_key?:string;
  style?:{
    div?:string;
    divInput?:string;
    input?:string;
    label?:string;
  }
  formExtra?: GenericRecord;
  valid?:boolean;
  validator?:{
    required?:boolean
  };
  showDownload?:boolean;
}

@Component({
    selector: 'app-file-input',
    imports: [
    FormsModule
],
    templateUrl: './file-input.component.html',
    styleUrl: './file-input.component.css'
})
export class FileInputComponent implements OnInit, OnChanges {
  private api = inject(ApiServiceService);
  utils = inject(UtilsService);
  private dialog = inject(VanillaDialogService);

  formData:FormData= new FormData()
  @Input() accept= '.pdf,.jpg,.jpeg,.png,.gif,.webp'
  @Input() label?:string
  @Input() multiple? =false
  @Input() key= 'file'
  @Input() divClass?= 'input-group shadow-sm '
  @Input() inputClass?= 'form-control'
  @Input() labelClass?:string
  @Input() apiUrl!:string
  @Input() formExtra?:Record<string, unknown>
  @Input() url?:string|null=''
  @Input() value?:string
  @Output() valueChange= new EventEmitter<string>()
  @Output() urlChange= new EventEmitter<string>()
  @Input() valid? =true
  @Output() validChange= new EventEmitter<boolean>()
  @Input() showDownload? =false
  @Input() showSimpleDownload =false
  @Input() sm?:boolean
  @Input() id?:string
  @Input() foreign_key?:string
  @Input() isImageChanging =false
  @Input() automaticSave =true
  @Input() showButton =true
  @Input() disabled =false

  @ViewChild('inputFile') input?: ElementRef
  refreshIframe =true;

  file?:File

  ngOnInit(){
    this.valid=true;
    this.validChange.emit(true)
  }

  ngOnChanges(changes:SimpleChanges){
    if(changes['id'] && this.id && this.foreign_key && this.formData.has(this.key)){
      this.upload()
    }

    if(this.url && changes['url']){
      console.log('cambio el url')
      this.refreshIframe=false
      setTimeout(()=>{
        this.refreshIframe=true
      },2000)
    }
  }

  async upload():Promise<boolean>{
    this.url=''
    this.isImageChanging=true
    if(this.formExtra){
      for(const key of Object.keys(this.formExtra)){
        this.formData.append(key,String(this.formExtra[key]))
      }
    }
    if(this.id && this.foreign_key){
      this.formData.append(this.foreign_key,this.id)
    }
    console.log(this.formData)
    if(this.apiUrl){
      const res= await firstValueFrom(this.api.postFormData(this.apiUrl,this.formData,false))
      if(res.status){
        this.url=res.url
        this.urlChange.emit(this.url)
        setTimeout(()=>{
          this.isImageChanging=false
        },200)
        return true;
      }
    }
    return false;
  }

  setFormData(event: Event) {
    console.log(event)
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      for (const file of inputElement.files) {
        this.formData = new FormData()
        this.formData.append(this.key, file, file.name);
        console.log(this.formData)
      }
      this.file= inputElement.files[0]
    }
    if(this.automaticSave){
      this.validateAutomaticSave()
    }
  }

  private validateAutomaticSave(){
    if(!this.url){
      this.upload()
      return
    }
    const action= this.dialog.show({
      title:'Seguro que deseas hacerlo?',
      body:'Ya existe un archivo subido, si subes uno nuevo, el viejo sera reemplazado, si estas seguro presiona si',
      respNo:'No',
      respYes:'Sí',
      tipo:'warning',
    })
    const sub= action.subscribe((res)=>{
      if(res && res.closedByAgree){
        this.upload()
        sub.unsubscribe()
      }
      if(res && res.closedByCancelled){
        this.input!.nativeElement=''
        sub.unsubscribe()
      }
    })
  }

  visualize(){
    if(!this.url) return
    window.open(this.utils.fileUrlInLine(this.url), '_blank');
  }

  isImage(file?: File): boolean {
    if (!file) return false;

    // Lista de tipos MIME de imágenes comunes
    const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    // Verificar si el tipo MIME del archivo está en la lista
    return imageMimeTypes.includes(file.type);
  }

  isPDFFile(file?: File): boolean {
    if(this.url && this.url.includes('.pdf')) return true
    if (!file) return false;

    // Verificar el tipo MIME del archivo
    const isPDFMimeType = file.type === 'application/pdf';

    // Verificar la extensión del archivo (opcional)
    const isPDFExtension = file.name.toLowerCase().endsWith('.pdf');

    // Devolver true si cumple con cualquiera de las condiciones
    return isPDFMimeType || isPDFExtension;
  }
}
