import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiDataService } from '../../../services/api-data.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setting } from '../../../models/setting';
import { Observable, Subscription } from 'rxjs';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings$: Observable<Setting[]>;
  settingEdit: FormGroup = new FormGroup({
    settingValue: new FormControl('', Validators.required)
  });
  subscription: Subscription;
  settings;

  constructor(
    private api: ApiDataService,
  ) {
  }

  ngOnInit(): void {
    this.settings$ = this.api.getApiConfigs().subscribe(next => this.settings = next);
  }

  changeSetting(configId: number): void {
    const {settingValue} = this.settingEdit.value;
    this.api.putApiConfig(configId, settingValue).subscribe(
      resp => {
        this.settings = this.settings.map((config: Setting) => {
          return config.configId === resp.configId
            ? {...config, configValue: resp.configValue}
            : {...config};
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
